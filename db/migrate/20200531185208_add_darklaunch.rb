class AddDarklaunch < ActiveRecord::Migration[6.0]
  def change
    create_table :darklaunches do |t|
      t.string :key, null: false, index: true
      t.references :player, null: false, index: {unique: true}
    end

    reversible do |dir|
      dir.up do
        if Player.count == 0
          Player.create!(name: 'ujihisa')
        end
        if player = Player.find(1)
          Darklaunch.create!(
            key: 'enable-bank-client-side-adjuetment-buttons',
            player: player)
        end
      end
    end
  end
end
