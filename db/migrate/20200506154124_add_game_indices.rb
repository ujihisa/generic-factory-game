class AddGameIndices < ActiveRecord::Migration[6.0]
  def change
    add_index :games, :updated_at
    add_index :games, [:player_id, :money, :month]
  end
end
