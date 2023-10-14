class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.integer :player_id, null: false
      t.integer :month, null: false, default: 0
      t.integer :money, null: false, default: 100
      t.integer :storage, null: false, default: 0
      t.integer :ingredient, null: false, default: 0
      t.integer :product, null: false, default: 0

      t.timestamps
    end
  end
end
