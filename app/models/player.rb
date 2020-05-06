class Player < ApplicationRecord
  validates_uniqueness_of :name
  validates :name, length: { in: 1..255 }

  def best_game
    Game.where('player_id = ? AND 1000 <= money', id).order('month ASC').limit(1).first
  end
end
