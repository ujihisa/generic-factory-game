class Game < ApplicationRecord
  belongs_to :player
  has_many :factories
  has_many :contracts

  def history
    history_encoded ? JSON.parse(history_encoded).freeze : {}.freeze
  end

  def set_history(key, value)
    self.history_encoded = history.merge(key => value).to_json
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
    [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ][month % 12]
  end

  def next_month
    [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ][month.succ % 12]
  end

  def production
    factories.map(&:performance).sum / 2
  end

  def capped_production
    [production, ingredient / 2].min
  end

  def idle_factory
    Factory.where(game_id: id, name: 'idle').first or raise 'Must not happen'
  end

  def active_factories
    Factory.where(game_id: id).where.not(name: 'idle').all
  end

  # Similar to save()
  def hire(employee_type)
    factory = idle_factory()
    raise 'Must not happen' unless factory

    raise 'Must not happen' unless Employee::RECRUITING_FEES[employee_type]
    self.cash -= Employee::RECRUITING_FEES[employee_type]

    case employee_type
    when :junior
      factory.junior += 1
    when :intermediate
      factory.intermediate += 1
    when :senior
      factory.senior += 1
    else
      raise 'Must not happen'
    end
    save && factory.save
  end

  def salary
    factories.map {|factory|
      factory.junior * 3 + factory.intermediate * 5 + factory.senior * 9
    }.sum
  end

  def interest
    ((10 - credit / 10.0) * 0.01 * debt).ceil
  end

  def settlement
    messages = []

    self.month += 1

    # produce
    production_vol = self.capped_production
    self.ingredient -= production_vol * 2

    # if self.ingredient + self.product + production_vol <= self.storage
    #   # good
    # else
    #   # pay penalty
    #   self.cash -= 10 * (self.ingredient + self.product + production_vol - self.storage)
    #   production_vol = self.storage - self.product - self.ingredient
    # end

    self.product += production_vol

    # Deliver products
    self.contracts.each do |contract|
      (required_products, sales) = Contract::RULES[contract.name][self.current_month]
      if required_products <= self.product
        # good
        self.product -= required_products
        self.cash += sales
      else
        # penalty
        self.cash -= sales * 10

        messages << "[PENALTY] Paid $#{sales * 10}K for contract #{contract.name}"
      end
    end

    # pay fees
    self.cash -= self.storage / 100
    messages << "Paid $#{self.storage / 100}K for storage maintenance"

    self.cash -= self.salary
    messages << "Paid $#{self.salary}K for employees salary" if 0 < salary

    self.cash -= self.interest
    messages << "Paid $#{self.interest}K for interest" if 0 < interest

    # receive ingredients
    self.ingredient += self.ingredient_subscription
    self.cash -= self.ingredient_subscription * 0.05
    messages << "Paid $#{self.ingredient_subscription * 0.05}K for ingredient subscription" if 0 < self.ingredient_subscription

    # overflow
    if self.storage < self.ingredient + self.production
      diff = self.ingredient - (self.storage - self.production)
      messages << "[ERROR] Received ingredients more than you can handle, so trashed #{diff}t ingredients"
      self.ingredient -= diff
    end

    messages
  end

  def self.best_games(game_version)
    Game.
      includes(:player).
      where('version = ? AND 1000 <= cash', game_version).
      order(month: :asc)
  end
end
