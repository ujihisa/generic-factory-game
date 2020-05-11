# frozen_string_literal: true

class Contract < ApplicationRecord
  Trade = Struct.new(:required_products, :sales)
  private_constant :Trade

  Rule = Struct.new(:default, :January, keyword_init: true) do
    alias orig_at []
    def [](month_str)
      raise ArgumentError unless %w[January].include?(month_str)
      orig_at(month.to_sym) || orig_at(:default)
    end
  end
  private_constant :Rule

  Contract = Struct.new(:name, :required_credit, :description, :trades) do
    def [](month_str)
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
      }.join(",\n")
    end
  end
  private_constant :Contract

  ALL = {
    'A' => Contract.new('A', 0, 'They have a big sale in Nov.', {
      default: Trade.new(20, 10),
      November: Trade.new(40, 20),
    }),

    'B' => Contract.new('B', 0, 'Their business is constant', {
      default: Trade.new(30, 15),
    }),

    'C' => Contract.new('C', 0, 'They have a vacation in Feb.', {
      default: Trade.new(40, 20),
      February: Trade.new(0, 0),
    }),

    'D' => Contract.new('D', 0, 'Summer is their battlefield', {
      default: Trade.new(60, 32),
      July: Trade.new(100, 50),
      August: Trade.new(100, 50),
    }),

    'E' => Contract.new('E', 0, 'They have a big sale in Dec. Also they are a little bit stingy.', {
      default: Trade.new(80, 38),
      December: Trade.new(160, 80),
    }),

    'F' => Contract.new('F', 0, 'They have a big sale in Dec.', {
      default: Trade.new(100, 50),
      December: Trade.new(200, 100),
    }),

    'G' => Contract.new('G', 0, 'They only sell twice a year, but both of them are vital to their business', {
      default: Trade.new(0, 0),
      January: Trade.new(100, 100),
      June: Trade.new(100, 100),
    }),
  }.freeze

  belongs_to :game
  validates :name, inclusion: ALL.keys
  validates_uniqueness_of :name, scope: :game_id
end
