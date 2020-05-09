class GameMore < ActiveRecord::Migration[6.0]
  def change
    rename_column :games, :money, :cash

    add_column :games, :history_encoded, :text
  end
end
