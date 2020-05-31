# frozen_string_literal: true

class Contract < Struct.new(:name, :mode, :required_credit, :description, :trades)
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
        "#{v.required_products}t for $#{v.sales}K (#{'%.2f' % (v.sales / v.required_products.to_f)} $K/t)"
      else
        "#{v.required_products}t for $#{v.sales}K in #{k} (#{'%.2f' % (v.sales / v.required_products.to_f)} $K/t)"
      end
    }
  end

  # For describe()
  def as_json(*)
    super.merge(describe: describe)
  end

  private_class_method :new

  ALL = {
    'Tutorial' => new('Tutorial', 'tutorial', 0, 'Just a tutorial dummy contract', {
      default: Trade.new(100, 95), # Math.sqrt(18) * 6 = 25
    }),

    'A' => new('A', 'easy', 0, 'They have a big sale in Nov.', {
      default: Trade.new(18, 28), # Math.sqrt(18) * 6 = 25
      November: Trade.new(38, 40), # Math.sqrt(38) * 6 = 37
    }),

    'B' => new('B', 'easy', 0, 'Their business is constant', {
      default: Trade.new(56, 30), # Math.sqrt(56) * 6 = 45
    }),

    'C' => new('C', 'easy', 0, 'Their business is constant', {
      default: Trade.new(100, 40), # Math.sqrt(100) * 6 = 60
    }),

    'D' => new('D', 'easy', 15, 'They close business only in January', {
      default: Trade.new(10, 18), # Math.sqrt(10) * 6 = 19
      January: Trade.new(0, 0),
    }),

    'E' => new('E', 'easy', 15, 'They have a sale in Dec.', {
      default: Trade.new(40, 37), # Math.sqrt(40) * 6 = 38
      December: Trade.new(80, 53), # Math.sqrt(80) * 6 = 54
    }),

    'F' => new('F', 'easy', 15, 'They have a big sale in Dec.', {
      default: Trade.new(80, 53), # Math.sqrt(80) * 6 = 54
      December: Trade.new(100, 59), # Math.sqrt(100) * 6 = 60
    }),

    'G' => new('G', 'easy', 30, 'They close business only in January', {
      default: Trade.new(20, 27), # Math.sqrt(20) * 6 = 27
      January: Trade.new(0, 0),
    }),

    'H' => new('H', 'easy', 30, 'Their business is constant', {
      default: Trade.new(60, 46), # Math.sqrt(60) * 6 = 46
    }),

    'I' => new('I', 'easy', 30, 'Their business is constant', {
      default: Trade.new(120, 66), # Math.sqrt(120) * 6 = 66
    }),

    'J' => new('J', 'easy', 45, 'They only need twice a year', {
      default: Trade.new(0, 0),
      July: Trade.new(200, 85), # Math.sqrt(200) * 6 = 85
      December: Trade.new(200, 85), # Math.sqrt(200) * 6 = 85
    }),

    # normal
    'NormalA' => new('A', 'normal', 0, 'Their business is constant', {
      default: Trade.new(40, 40),
    }),

    'NormalB' => new('B', 'normal', 0, 'They only make their best deals', {
      default: Trade.new(180, 40), # Math.sqrt(56) * 6 = 45
      December: Trade.new(190, 50), # Math.sqrt(56) * 6 = 45
    }),

    'NormalC' => new('C', 'normal', 0, "They only make their best deals", {
      default: Trade.new(300, 50), # Math.sqrt(100) * 6 = 60
      December: Trade.new(380, 60), # Math.sqrt(100) * 6 = 60
    }),

    'NormalD' => new('D', 'normal', 15, 'They close business only in January', {
      default: Trade.new(10, 17), # Math.sqrt(10) * 6 = 19
      January: Trade.new(0, 0),
    }),

    'NormalE' => new('E', 'normal', 15, 'They have a sale in Dec.', {
      default: Trade.new(40, 33), # Math.sqrt(40) * 6 = 38
      December: Trade.new(80, 55), # Math.sqrt(80) * 6 = 54
    }),

    'NormalF' => new('F', 'normal', 15, 'They have a big sale in Dec.', {
      default: Trade.new(200, 50),
      December: Trade.new(400, 100),
    }),

    'NormalG' => new('G', 'normal', 20, 'They close business only in December', {
      default: Trade.new(60, 39),
      December: Trade.new(0, 0),
    }),

    'NormalH' => new('H', 'normal', 25, 'Their business is constant', {
      default: Trade.new(140, 80),
    }),

    'NormalI' => new('I', 'normal', 30, 'Their business is constant', {
      default: Trade.new(18, 10),
    }),

    'NormalJ' => new('J', 'normal', 50, 'They have big sales in Nov and Dec', {
      default: Trade.new(127, 43),
      November: Trade.new(187, 60), # Math.sqrt(200) * 6 = 85
      December: Trade.new(180, 60), # Math.sqrt(200) * 6 = 85
    }),

    'NormalK' => new('K', 'normal', 55, 'Their business is constant', {
      default: Trade.new(100, 30),
    }),

    'NormalL' => new('L', 'normal', 70, 'They close during summer', {
      default: Trade.new(500, 150),
      July: Trade.new(0, 0),
      August: Trade.new(0, 0),
      September: Trade.new(0, 0),
    }),

    'NormalM' => new('City Project', 'normal', 80, 'For a public service', {
      default: Trade.new(1000, 300),
    }),

    # 'NormalN' => new('National Project', 'normal', 90, 'For an epic public service', {
    #   default: Trade.new(2000, 550),
    # }),
  }
  private_constant :ALL

  # ActiveRecord'ish UIs
  def self.find(name:)
    ALL[name] ||
      new('DUMMY', 'easy', 0, 'Dummy contract', {
        default: Trade.new(1, 1),
      })
  end

  def self.dump(mode)
    ALL.select {|_, c| c.mode == mode }.transform_values {|contract|
      trades = Game::MONTHS.to_h {|m|
        v = contract.trades[m.to_sym]&.to_h&.merge(anomaly: true) || contract.trades[:default]&.to_h
        [m, v]
      }
      contract.to_h.merge(describe: contract.describe, trades: trades)
    }
  end
end
