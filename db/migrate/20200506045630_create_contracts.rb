class CreateContracts < ActiveRecord::Migration[6.0]
  def change
    create_table :contracts do |t|
      t.integer :game_id, null: false
      t.string :name, null: false

      t.timestamps null: false

      t.index [:game_id, :name], unique: true
    end
  end
end
