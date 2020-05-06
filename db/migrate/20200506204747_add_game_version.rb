class AddGameVersion < ActiveRecord::Migration[6.0]
  def up
    add_column :games, :version, :string
    add_index :games, :version
    Game.where(version: nil).update_all(version: '0.0.1')
    change_column :games, :version, :string, null: false
  end

  def down
    raise 'not implemented'
  end
end
