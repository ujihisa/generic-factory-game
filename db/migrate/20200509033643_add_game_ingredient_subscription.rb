class AddGameIngredientSubscription < ActiveRecord::Migration[6.0]
  def up
    add_column :games, :ingredient_subscription, :integer
    Game.where(ingredient_subscription: nil).update_all(ingredient_subscription: 0)
    change_column :games, :ingredient_subscription, :integer, null: false
  end

  def down
    remove_column :games, :ingredient_subscription
  end
end
