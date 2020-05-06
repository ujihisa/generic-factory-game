class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.player :player
      t.integer :month
      t.integer :money
      t.integer :storage
      t.integer :ingredient
      t.integer :product

      t.timestamps
    end
  end
end
