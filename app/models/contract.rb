# frozen_string_literal: true

class Contract < Struct.new(:name, :required_credit, :description, :trades)
  Trade = Struct.new(:required_products, :sales)
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
      default: Trade.new(20, 6),
      November: Trade.new(40, 12),
    }),

    'B' => new('B', 0, 'Their business is constant', {
      default: Trade.new(32, 9),
    }),

    'C' => new('C', 0, 'Their business is constant, but they pay only twice a year.', {
      default: Trade.new(40, 0),
      January: Trade.new(40, 75),
      July: Trade.new(40, 75),
    }),

    'D' => new('D', 10, 'They are rich. Summer is their battlefield', {
      default: Trade.new(60, 21),
      July: Trade.new(100, 35),
      August: Trade.new(100, 35),
    }),

    'E' => new('E', 10, 'They have a big sale in Dec. Also they are a little bit stingy.', {
      default: Trade.new(80, 25),
      December: Trade.new(160, 50),
    }),

    'F' => new('F', 20, 'They have a big sale in Dec.', {
      default: Trade.new(100, 40),
      December: Trade.new(200, 80),
    }),

    'G' => new('G', 30, 'They only sell twice a year, but both of them are vital to their business', {
      default: Trade.new(0, 0),
      January: Trade.new(100, 45),
      June: Trade.new(100, 45),
    }),

    'H' => new('H', 30, 'Their business is constant', {
      default: Trade.new(220, 80),
    }),

    'I' => new('I', 40, 'Their business is constant', {
      default: Trade.new(100, 50),
    }),

    'J' => new('J', 30, 'They are busy in winter season', {
      default: Trade.new(100, 45),
      November: Trade.new(200, 90),
      December: Trade.new(200, 90),
      January: Trade.new(200, 90),
      February: Trade.new(200, 90),
    }),

    'Y' => new('Y', 90, "City project", {
      default: Trade.new(500, 250),
    }),

    'Z' => new('Z', 100, "National project", {
      default: Trade.new(800, 400),
    }),
  }.freeze
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
