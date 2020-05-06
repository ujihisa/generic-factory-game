class Player < ApplicationRecord
  def best_game
    Game.where('player_id = ? AND 1000 <= money', id).order('month DESC').limit(1).first
  end
end
