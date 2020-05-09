class AddGameIngredientSubscription < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :ingredient_subscription, :integer
    rename_column :games, :money, :cash
  end
end
