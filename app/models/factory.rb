class Factory < ApplicationRecord
  belongs_to :game
  validates :name, inclusion: ['idle', 'manual', 'semi-auto', 'full-auto']
  validates_uniqueness_of [:game_id, :name]

  def cost_to_buy
    case name
    when 'idle', 'manual'
      0
    when 'semi-auto'
      90
    when 'full-auto'
      180
    else
      raise 'Must not happen'
    end
  end
end
