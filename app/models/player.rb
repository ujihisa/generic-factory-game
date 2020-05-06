class Player < ApplicationRecord
  validates_uniqueness_of :name
  validates :name, length: { in: 1..255 }

  def best_game
    Game.
      where('version = ? AND player_id = ? AND 1000 <= money', GenericFactoryGame::VERSION, id).
      order('month ASC').
      limit(1).
      first
  end

  def previous_best_game
    Game.
      where('version = ? AND player_id = ? AND 1000 <= money', GenericFactoryGame::PREVIOUS_VERSION, id).
      order('month ASC').
      limit(1).
      first
  end
end
