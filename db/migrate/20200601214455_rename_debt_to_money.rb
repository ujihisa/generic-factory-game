class RenameDebtToMoney < ActiveRecord::Migration[6.0]
  class Game < ApplicationRecord
  end

  def change
    change_table(:games) do |t|
      t.rename :debt, :money
    end

    reversible do |dir|
      dir.up do
        Game.find_each do |game|
          game.money = game.cash - game.money
          game.save!(touch: false)
        end
      end

      dir.down do
        raise
      end
    end
  end
end
