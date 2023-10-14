class GameMore < ActiveRecord::Migration[6.0]
  def change
    change_table :games do |t|
      t.rename :money, :cash

      # Q. Why not PostgreSQL Array?
      # A. Sqlite3 does not have that. Also the app always needs the whole body.
      t.text :messages_raw, null: false, default: '[]'
      t.text :portfolios_raw, null: false, default: '[]'
      t.text :signed_contracts_raw, null: false, default: '[]'
      t.text :equipment_names_raw, null: false, default: '[]'
      t.text :assignments_raw, null: false, default: '[]'

      t.float :quality, null: false, default: 0.0
      t.string :mode, null: false, default: 'normal'
      t.index :mode

      t.boolean :advertising, null: false, default: false
    end
  end
end
