class CreateIngredientDeliveries < ActiveRecord::Migration[6.0]
  def change
    create_table :ingredient_deliveries do |t|
      t.references :game, null: false, foreign_key: true
      t.integer :arrival_month, null: false
      t.integer :volume, null: false

      t.timestamps
    end
  end
end
