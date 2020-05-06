class Factory < ApplicationRecord
  belongs_to :game
  validates :name, inclusion: ['idle', 'manual', 'semi-auto', 'full-auto']
  validates_uniqueness_of :name, scope: :game_id

  COST_TO_BUY = {
    'idle': 0,
    'manual': 0,
    'semi-auto': 90,
    'full-auto': 180,
  }.freeze
end
