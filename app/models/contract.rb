# frozen_string_literal: true

class Contract < Struct.new(:name, :required_credit, :description, :trades)
  class Trade < Struct.new(:required_products, :sales)
    def initialize(*)
      super
      freeze
    end
  end
  private_constant :Trade

  def trade(month_str)
    case month_str
    when *Game::MONTHS
      trades[month_str.to_sym] || trades[:default]
    else
      raise ArgumentError, "#{month_str.inspect} is not a valid month name"
    end
  end

  def describe
    trades.map {|k, v|
      case k
      when :default
        "#{v.required_products}t for $#{v.sales}K"
      else
        "#{v.required_products}t for $#{v.sales}K in #{k}"
      end
    }
  end

  # For describe()
  def as_json(*)
    super.merge(describe: describe)
  end

  private_class_method :new

  ALL = {
    'A' => new('A', 0, 'They have a big sale in Nov.', {
      default: Trade.new(18, 28),
      November: Trade.new(38, 40),
    }),

    'B' => new('B', 0, 'Their business is constant', {
      default: Trade.new(56, 30),
    }),

    'C2' => new('C2', 0, 'Their business is constant', {
      default: Trade.new(100, 40),
    }),

    'C' => new('C', 20, 'Their business is constant, but they pay only twice a year.', {
      default: Trade.new(40, 0),
      January: Trade.new(40, 75),
      July: Trade.new(40, 75),
    }),

    'D' => new('D', 20, 'They close business only in January', {
      default: Trade.new(10, 16),
      January: Trade.new(0, 0),
    }),

    'E' => new('E', 20, 'They have a sale in Dec.', {
      default: Trade.new(40, 32),
      December: Trade.new(60, 39),
    }),

    'F' => new('F', 20, 'They have a big sale in Dec.', {
      default: Trade.new(80, 45),
      December: Trade.new(100, 50),
    }),

    'G' => new('G', 40, 'They close business only in January', {
      default: Trade.new(20, 27),
      January: Trade.new(0, 0),
    }),

    'H' => new('H', 40, 'Their business is constant', {
      default: Trade.new(60, 47),
    }),

    'I' => new('I', 40, 'Their business is constant', {
      default: Trade.new(120, 66),
    }),

    'J' => new('J', 40, 'They are busy in winter season', {
      default: Trade.new(100, 45),
      November: Trade.new(200, 90),
      December: Trade.new(200, 90),
      January: Trade.new(200, 90),
      February: Trade.new(200, 90),
    }),

    'Y' => new('Y', 80, "City project", {
      default: Trade.new(500, 250),
    }),

    'Z' => new('Z', 90, "National project", {
      default: Trade.new(800, 400),
    }),
  }
  private_constant :ALL

  # ActiveRecord'ish UIs
  def self.find(name:)
    ALL[name]
  end

  def self.dump
    ALL.transform_values {|contract|
      trades = Game::MONTHS.to_h {|m|
        v = contract.trades[m.to_sym]&.to_h&.merge(anomaly: true) || contract.trades[:default]&.to_h
        [m, v]
      }
      contract.to_h.merge(describe: contract.describe, trades: trades)
    }
  end
end
