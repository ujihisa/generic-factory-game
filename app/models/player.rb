class Player < ApplicationRecord
  validates_uniqueness_of :name
  validates :name, length: { in: 1..255 }
  has_many :games
  has_one :user

  def best_game(mode)
    Game.
      latest.
      where(version: GenericFactoryGame::VERSION, player_id: id, cash: (1000..), mode: mode).
      order(month: :asc).
      limit(1).
      first
  end

  def previous_best_game
    Game.
      latest.
      where('version = ? AND player_id = ? AND 1000 <= cash', GenericFactoryGame::PREVIOUS_VERSION, id).
      order(month: :asc).
      limit(1).
      first
  end
end
