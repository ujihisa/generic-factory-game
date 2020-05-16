# frozen_string_literal: true

class Game < ApplicationRecord
  belongs_to :player

  latest_columns = column_names.map(&:to_sym) - [:messages_raw, :portfolios_raw]
  scope :latest, -> { select(latest_columns) }

  validates :mode, inclusion: { in: %w(normal tutorial) }
  validate :validate_assignments
  validate :validate_factory_equipments
  validate :validate_ingredient_and_product

  MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ].freeze

  INGREDIENT2PRODUCT = 1

  def messages
    JSON.parse(messages_raw).freeze
  end

  def messages=(value)
    self.messages_raw = value.to_json
  end

  def portfolios
    JSON.parse(portfolios_raw).freeze
  end

  def portfolios=(value)
    self.portfolios_raw = value.to_json
  end

  def portfolio
    keys = [
      'month', 'cash', 'storage', 'ingredient', 'product', 'credit', 'debt',
      'ingredient_subscription',
    ]
    pf = keys.zip(self.attributes.values_at(*keys)).to_h
  end

  def signed_contracts
    JSON.parse(signed_contracts_raw)
  end

  def signed_contracts=(x)
    self.signed_contracts_raw = x.to_json
  end

  def equipments
    JSON.parse(equipment_names_raw).map {|name|
      Factory.lookup(equipment_name: name.to_sym)
    }
  end

  def equipments=(x)
    self.equipment_names_raw = x.map { _1[:name] }.to_json
  end

  # assignments_raw: '[["Produce", "Junior", 2], ...]'
  # assignments: [Assignment, ...]
  def assignments
    @assignments ||=
      JSON.parse(assignments_raw).map {|r, eg_name, num|
        Assignment.new(r.to_sym, EmployeeGroup.lookup(eg_name.to_sym).category, num)
      }
  end

  def assignments=(x)
    self.assignments_raw = x.map(&:values).to_json
    @assignments = nil
  end

  def status
    if cash < 0
      :game_over
    elsif 1000 <= cash - debt
      :completed
    else
      :in_progress
    end
  end

  def current_month
    MONTHS[month % 12]
  end

  def next_month
    MONTHS[month.succ % 12]
  end

  def factory
    Factory.new(equipments, assignments)
  end

  def capped_production
    [factory.production_volume, ingredient * INGREDIENT2PRODUCT].min
  end

  # TODO: move to game.organization.salary
  def organization_salary
    self.assignments.sum {|assignment|
      EmployeeGroup.lookup(assignment.employee_group_name).salary * assignment.num
    }
  end

  def interest
    ((10 - credit / 10.0) * 0.01 * debt).ceil
  end

  # Like update(), it doesn't save.
  def settlement
    messages = []

    self.month += 1
    credit_diff = 0

    # produce
    production_vol = self.capped_production
    self.ingredient -= production_vol / INGREDIENT2PRODUCT
    messages << "🏭 Consume #{production_vol / INGREDIENT2PRODUCT}t ingredients" if 0 < production_vol
    messages << "🏭 Produce #{production_vol}t products" if 0 < production_vol

    self.quality = (self.quality * self.product + self.factory.production_quality * production_vol) / (self.product + production_vol).to_f
    self.quality = 0 if self.quality.nan?
    self.product += production_vol

    # Deliver products
    (delivery_total, sales_total) = [0, 0]
    self.signed_contracts.each do |contract_name|
      trade = Contract.find(name: contract_name)[self.current_month]
      if trade.required_products <= self.product
        # good
        self.product -= trade.required_products
        self.cash += trade.sales

        delivery_total += trade.required_products; sales_total += trade.sales
      else
        # penalty
        self.cash -= trade.sales * 10
        credit_diff -= 10

        messages << "⚠️ Products not enough"
        messages << "💸 Pay $#{trade.sales * 10}K penalty for contract #{contract_name}"
      end
    end
    if 0 < delivery_total
      messages << "📜 Deliver #{delivery_total}t products"
      messages << "📜 Gain $#{sales_total}K sales"

      credit_diff +=
        case self.credit
        when (0..19), (20..39)
          self.signed_contracts.size
        when (40..59)
          1
        else
          0
        end
    end

    credit_diff =
      case quality
      when ((credit + 10)..)
        3
      when ((credit + 5)..)
        2
      when ((credit + 1)..)
        1
      when ((credit + 0)..)
        0
      when ((credit - 5)..)
        -1
      when ((credit - 10)..)
        -2
      else
        -3
      end
    credit_diff = 0 if delivery_total == 0


    # pay fees
    self.cash -= self.storage / 100
    messages << "🗄️ Pay $#{self.storage / 100}K for storage" if 0 < storage

    salary = self.organization_salary
    self.cash -= salary
    messages << "💼 Pay $#{salary}K for salary" if 0 < salary

    self.cash -= self.interest
    messages << "🏦 Pay $#{self.interest}K for interest" if 0 < interest

    equipments_cost = self.equipments.sum {|eqt| eqt[:cost] }
    self.cash -= equipments_cost
    messages << "🏭 Pay $#{equipments_cost}K for factory equipments" if 0 < equipments_cost

    # advertise
    if self.advertising
      credit_diff += 10
      self.advertising = false
    end

    if credit_diff != 0
      self.credit = self.class.normalize_credit(self.credit + credit_diff)
      messages << "❤️ #{"++-"[credit_diff <=> 0]}#{credit_diff.abs} credit"
    end

    # receive ingredients
    self.ingredient += self.ingredient_subscription
    self.cash -= self.ingredient_subscription * 0.05
    messages << "📦 Receive #{self.ingredient_subscription}t ingredient" if 0 < self.ingredient_subscription
    messages << "📦 Pay $#{(self.ingredient_subscription * 0.05).to_i}K for subscription" if 0 < self.ingredient_subscription

    # overflow
    if self.storage < self.ingredient + self.product
      diff = self.ingredient - (self.storage - self.product)
      messages << "🗑️ Dispose #{diff}t ingredient due to overflow"
      self.ingredient -= diff
    end

    messages << "💵 Cash balance $#{self.cash}K"
    self.portfolios += [self.portfolio]

    self.messages = messages
    nil
  end

  # Always between 0 to 100
  def self.normalize_credit(credit)
    [[0, credit].max, 100].min
  end

  def self.best_games(game_version)
    Game.
      latest.
      includes(:player).
      where('version = ? AND 1000 <= cash AND mode = "normal"', game_version).
      order(month: :asc)
  end

  # TODO: Move this to Game::Organization model, so that you can call @game.organization.hire
  # Returns the total recruiting fee, if it's valid
  def organization_hire(num_employees)
    num_employees.each do |_, num|
      raise 'Must not happen' if num < 0
    end

    new_assignments = self.assignments.dup
    num_employees.each do |(eg_name, num)|
      assignment = new_assignments.find {|d| d.employee_group_name == eg_name }
      if assignment
        assignment.num += num
      else
        new_assignments << Assignment.new(:produce, eg_name, num)
      end
    end
    self.assignments = new_assignments

    if valid?
      fee = num_employees.sum {|eg_name, num| num * EmployeeGroup.lookup(eg_name)[:recruiting_fee] }
      self.cash -= fee
      fee
    end
  end

  def signed_contracts_product_required(display_month)
    signed_contracts.sum {|name|
      Contract.find(name: name)[display_month].required_products 
    }
  end

  # TODO: Move this inner validation into Assignment model
  private def validate_assignments
    self.assignments.each do |assignment|
      eg = EmployeeGroup.lookup(assignment.employee_group_name)
      if eg
        if 0 < eg.num_hired.to_i && self.credit < eg.required_credit
          self.errors.add(:assignments, "Not enough credit to hire #{assignment.employee_group_name}")
        else
          # Yes it's valid!
        end
      else
        self.errors.add(:assignments, "Invalid employee_group_name: #{assignment.employee_group_name}")
      end
    end
  end

  private def validate_ingredient_and_product
    if self.storage < self.ingredient + self.product
      self.errors.add(:storage, "Not enough storage for your ingredient and product")
    end
  end

  private def validate_factory_equipments
    dups = self.equipments.map { _1[:name] }.tally.select {|_, v| 1 < v}.keys
    if dups.present?
      self.errors.add(:equipments, "Duplicate equipments: #{dups.join(', ')}")
    end
  end

  def buyinstall_equipment(equipment)
    self.cash -= equipment[:install]
    self.equipments += [equipment]
    nil
  end

  def factory_assign_add(eg_name, produce:, mentor:)
    ds = self.assignments
    (d_produce, d_mentor) = ds.select {|d|
      d.employee_group_name == eg_name
    }.then {|ds|
      [ds.find {|d| d.role == :produce }, ds.find {|d| d.role == :mentor }]
    }
    new_d_produce = d_produce ? d_produce.dup.tap { _1.num += produce } : Assignment.new(:produce, eg_name, produce)
    new_d_mentor = d_mentor ? d_mentor.dup.tap { _1.num += mentor } : Assignment.new(:mentor, eg_name, mentor)
    self.assignments = (
      ds - [d_produce, d_mentor] + [new_d_produce, new_d_mentor])
    nil
    # TODO: validate the sum
    # TODO: validate negative
  end
end
