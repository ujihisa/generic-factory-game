# frozen_string_literal: true

class Contract < ApplicationRecord
  # [volume, fee]
  RULES = {
    'A' => Hash.new([20, 10]).tap {|h|
      h['November'] = [40, 20]
    }.freeze,
    'B' => Hash.new([40, 20]).tap {|h|
      h['February'] = [0, 0]
    }.freeze,
    'C' => Hash.new([60, 32]).tap {|h|
      h['July'] = [100, 50]
      h['August'] = [100, 50]
    }.freeze,
    'D' => Hash.new([80, 38]).tap {|h|
      h['December'] = [160, 80]
    }.freeze,
    'E' => Hash.new([100, 50]).tap {|h|
      h['December'] = [200, 100]
    }.freeze,
  }.freeze

  belongs_to :game
  validates :name, inclusion: RULES.keys
  validates_uniqueness_of :name, scope: :game_id

  DESCRIPTIONS = {
    'A' => <<~EOS.chomp,
        20t for $10K,
        40t for $20K in November
      EOS
    'B' => <<~EOS.chomp,
        40t for $20K,
        0t for $0K in February
      EOS
    'C' => <<~EOS.chomp,
        60t for $32K,
        100t for $50K in July and August
      EOS
    'D' => <<~EOS.chomp,
        80t for $38K,
        160t for $80K in December
      EOS
    'E' => <<~EOS.chomp,
        100t for $50K,
        200t for $100K in December
      EOS
  }
end
