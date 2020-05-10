class AddGameCredit < ActiveRecord::Migration[6.0]
  def up
    change_column :games, :money, :integer, default: 100, null: false
    add_column :games, :credit, :integer, default: 0, null: false
    add_column :games, :debt, :integer, default: 0, null: false
  end

  def down
    change_column :games, :money, :integer, default: 100, null: false
    remove_column :games, :credit
    remove_column :games, :debt
  end
end
