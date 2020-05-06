class CreateFactories < ActiveRecord::Migration[6.0]
  def change
    create_table :factories do |t|
      t.integer :game_id, null: false
      t.string :name, null: false
      t.integer :junior, default: 0, null: false
      t.integer :intermediate, default: 0, null: false
      t.integer :senior, default: 0, null: false

      t.timestamps null: false

      t.index [:game_id, :name], unique: true
    end
  end
end
