class AddGameCredit < ActiveRecord::Migration[6.0]
  def up
    change_column :games, :money, :integer, default: 0, null: false
    add_column :games, :credit, :integer, default: 20, null: false
    add_column :games, :debt, :integer, default: 0, null: false
  end

  def down
    raise 'not implemented yet'
  end
end
