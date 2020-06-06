# frozen_string_literal: true

class Game < ApplicationRecord
  belongs_to :player

  latest_columns = column_names.map(&:to_sym) - [:messages_raw, :portfolios_raw]
  scope :latest, -> { includes(:player).select(latest_columns) }

  validates :mode, inclusion: { in: %w(easy normal tutorial) }
  validate :validate_assignments
  validate :validate_factory_equipments
  validate :validate_ingredient_and_product
  validate :validate_signed_contracts
  validate :validate_latest

  MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ].freeze

  INGREDIENT2PRODUCT = 1

  def debt
    cash - money
  end

  def debt=(x)
    x = x.to_i
    self.money = cash - x
  end

  def cash=(x)
    x = x.to_i
    diff = x - self[:cash]

    self[:cash] += diff
    self[:money] += diff
  end

  def messages
    JSON.parse(messages_raw).freeze
  end

  def messages=(value)
    self.messages_raw = value.to_json
  end

  def alerts
    JSON.parse(alerts_raw).freeze
  end

  def alerts=(value)
    self.alerts_raw = value.to_json
  end

  def portfolios
    JSON.parse(portfolios_raw).freeze
  end

  def portfolios=(value)
    self.portfolios_raw = value.to_json
  end

  def portfolio
    keys = [
      'month', 'cash', 'storage', 'ingredient', 'product', 'credit',
      'ingredient_subscription',
    ]
    pf = keys.zip(self.attributes.values_at(*keys)).to_h.merge(
      'debt' => debt,
      'portfolio_version' => 0,
    )
    pf
  end

  serialize :signed_contracts, SignedContracts

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
    JSON.parse(assignments_raw).map {|r, eg_name, num|
      Assignment.new(r.to_sym, EmployeeGroup.lookup(eg_name.to_sym).category, num).freeze
    }.freeze
  end

  def assignments=(x)
    self.assignments_raw = x.map(&:values).to_json
  end

  # employee_groups_raw: '{"Junior" => 2, "Motivated intermediate" => 1, ...}'
  def employee_groups
    hash = JSON.parse(employee_groups_raw)
    EmployeeGroup::ALL.to_h {|k, v|
      v = v.dup
      v.num_hired = hash[k.to_s] || 0
      [k, v.freeze]
    }.freeze
  end

  def employee_groups=(hash)
    self.employee_groups_raw = hash.transform_values(&:num_hired).to_json
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
    self.employee_groups.values.sum {|eg|
      eg.salary_total
    }
  end

  def interest
    ((10 - credit / 10.0) * 0.01 * debt).ceil
  end

  # Like update(), it doesn't save.
  def settlement
    messages = []
    alerts = []

    self.portfolios += [self.portfolio]

    self.month += 1

    # produce
    production_vol = self.capped_production
    self.ingredient -= production_vol / INGREDIENT2PRODUCT
    messages << "📦 Consume #{production_vol / INGREDIENT2PRODUCT}t ingredients" if 0 < production_vol
    messages << "🏭 Produce #{production_vol}t products" if 0 < production_vol

    self.quality = (self.quality * self.product + self.factory.production_quality * production_vol) / (self.product + production_vol).to_f
    self.quality = 0 if self.quality.nan?
    self.product += production_vol

    # Deliver products
    (delivery_total, sales_total) = [0, 0]
    self.signed_contracts.each do |contract, month|
      trade = contract.trade(self.current_month)
      payment_trade = contract.trade(MONTHS[(self.month - 3) % 12])

      if trade.required_products <= self.product
        # good
        self.product -= trade.required_products
        sales_total += payment_trade.sales if 2 < self.month - month

        delivery_total += trade.required_products
      else
        # penalty
        self.cash -= trade.sales * 10

        alerts << "⚠️ Products not enough"
        alerts << "💸 -$#{trade.sales * 10}K penalty for contract #{contract.name}"
      end
    end
    self.cash += sales_total
    if 0 < delivery_total
      messages << "📜 Deliver #{delivery_total}t products"
      messages << "📜 +$#{sales_total}K sales"
    end

    credit_diff = 0
    if 0 < delivery_total
      credit_diff =
        case quality - credit
        when (10..)
          3
        when (5..)
          2
        when (1..)
          1
        when (0..)
          0
        when (-5..)
          -1
        when (-10..)
          -2
        else
          -3
        end
      messages << "❤️ #{"++-"[credit_diff <=> 0]}#{credit_diff.abs} credit from product quality"
    end

    # advertise
    if self.advertising
      credit_diff += 10
      messages << "❤️ +10 credit from advertisement"

      self.advertising = false
    end
    self.credit = self.class.normalize_credit(self.credit + credit_diff) if credit_diff

    # pay fees
    self.cash -= self.storage / 100
    messages << "🗄️ -$#{self.storage / 100}K for storage" if 0 < storage

    salary = self.organization_salary
    self.cash -= salary
    messages << "💼 -$#{salary}K for salary" if 0 < salary

    self.cash -= self.interest
    messages << "🏦 -$#{self.interest}K for interest" if 0 < interest

    equipments_cost = self.factory.equipments_cost
    self.cash -= equipments_cost
    messages << "🏭 -$#{equipments_cost}K for factory equipments" if 0 < equipments_cost

    # receive ingredients
    if 0 < self.ingredient_subscription
      self.ingredient += self.ingredient_subscription
      fee_subscription = (self.ingredient_subscription * 0.10).to_i
      self.cash -= fee_subscription
      messages << "📦 -$#{fee_subscription}K for subscription"
      messages << "📦 Receive #{self.ingredient_subscription}t ingredient"
    end

    # overflow
    if self.storage < self.ingredient + self.product
      diff = self.ingredient - (self.storage - self.product)
      penalty = (diff / 5.0).ceil

      alerts << "🗑️ Dispose #{diff}t ingredient due to overflow"
      alerts << "🗑️ -$#{penalty}K penalty for the ingredient overflow"
      self.ingredient -= diff
      self.cash -= penalty
    end

    if self.cash < 0
      alerts << "💵 Cash balance $#{self.cash}K"
    else
      messages << "💵 Cash balance $#{self.cash}K"
    end
    self.portfolios += [self.portfolio]

    self.messages = messages
    self.alerts = alerts
    nil
  end

  # Always between 0 to 100
  def self.normalize_credit(credit)
    [[0, credit].max, 100].min
  end

  def self.best_games(game_version, mode)
    query = Game.
      latest.
      includes(:player).
      where(version: game_version, cash: (1000..), mode: mode).
      order(month: :asc, updated_at: :asc)
    query.to_a.uniq(&:player_id) # :(
  end

  # TODO: Move this to Game::Organization model, so that you can call @game.organization.hire
  # Returns the total recruiting fee, if it's valid
  def organization_hire(num_employees)
    num_employees.each do |_, num|
      raise 'Must not happen' if num < 0
    end

    # assignments_raw
    new_assignments = self.assignments.map(&:dup)
    num_employees.select { _2 != 0 }.each do |(eg_name, num)|
      category = EmployeeGroup.lookup(eg_name).category
      assignment = new_assignments.find {|a| a.employee_group_name == category }
      if assignment
        assignment.num += num
      else
        new_assignments << Assignment.new(:produce, category, num)
      end
    end
    self.assignments = new_assignments.freeze

    # employee_groups_raw
    self.employee_groups = employee_groups.to_h {|k, v|
      v = v.dup
      v.num_hired += num_employees[k] || 0
      [k, v]
    }

    # recruiting_fee
    if valid?
      fee = num_employees.sum {|eg_name, num| num * EmployeeGroup.lookup(eg_name)[:recruiting_fee] }
      self.cash -= fee
      fee
    end
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
    # Duplicates
    dups = self.equipments.map { _1[:name] }.tally.select {|_, v| 1 < v}.keys
    if dups.present?
      self.errors.add(:equipments, "Duplicate equipments: #{dups.join(', ')}")
    end

    # Mode
    self.equipments.
      reject {|equipment| equipment[:modes].include?(self.mode) }.
      each do |equipment|
        self.errors.add(:equipments, "Not allowed for your game mode #{self.mode}")
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

  private def validate_signed_contracts
    # Name
    unless signed_contracts.valid?
      signed_contracts.errors.messages.each do |message|
        self.errors.add(:signed_contracts, message)
      end
      return
    end

    (before, after) = changes['signed_contracts']
    if before
      after.diff(before).each do |added_contract, month|
        # Credit
        if self.credit < added_contract.required_credit
          self.errors.add(:signed_contracts, 'Not enough credit')
        end

        # Duplicate
        before.
          select {|c, m| c.name == added_contract.name && m != month }.
          each do |c, m|
            self.errors.add(:signed_contracts, "#{c.name} has been signed at month #{m}")
          end
      end
    end
  end

  private def validate_latest
    unless self.version == GenericFactoryGame::VERSION
      self.errors.add(:version, "You can't play a game from old version")
    end
  end

  def hint(estimate)
    case
    when self.ingredient < self.signed_contracts.product_required(self.next_month)
      if 10 <= self.credit
          {
            fact: "You are missing products because you don't have enough ingredient.",
            suggestion: "Buy ingredient now. Also, subscribe some ingredients to prevent this to happen again.",
          }
      else
        {
          fact: "You are missing products because you don't have enough ingredient.",
          suggestion: "Buy ingredient now.",
        }
      end
    when self.factory.production_volume < self.signed_contracts.product_required(self.current_month)
      if !self.factory.have_base?
        {
          fact: "You have enough ingredients, but your factory doesn't produce anything without a factory base.",
          suggestion: "Buy&instal a factory base.",
        }
      elsif self.assignments.sum(&:num) == 0
        {
          fact: "You have enough ingredients, but your factory can't produce enough products the contracts require.",
          suggestion: "Hire more employees",
        }
      elsif 0 < self.assignments.select {|a| a.role == :mentor }.sum(&:num)
        {
          fact: "You have enough ingredients, but your factory can't produce enough products the contracts require.",
          suggestion: "Hire more employees, buy&install more factory equipments, or let mentors produce instead.",
        }
      else
        {
          fact: "You have enough ingredients, but your factory can't produce enough products the contracts require.",
          suggestion: "Hire more employees, or buy&install more factory equipments",
        }
      end
    when estimate.cash < 0
      if estimate.alerts.grep_v(/Cash balance/).present?
        {
          fact: "Next month, your cash will run out",
          suggestion: "Try resolving the warnings",
        }
      elsif self.debt < self.max_debt
        {
          fact: "Next month, your cash will run out",
          suggestion: "Borrow money from Bank",
        }
      else
        {
          fact: "Next month, your cash will run out",
          suggestion: "Oh... no...",
        }
      end
    end
  end

  def max_debt
    credit * 10
  end
end
