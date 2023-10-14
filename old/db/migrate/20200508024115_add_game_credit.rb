class AddGameCredit < ActiveRecord::Migration[6.0]
  def change
    reversible do |dir|
      change_table :games do |t|
        dir.up do
          t.integer :credit, default: 0, null: false
          t.integer :debt, default: 0, null: false
        end
        dir.down do
          t.remove :debt
          t.remove :credit
        end
      end
    end

    reversible do |dir|
      change_table :games do |t|
        dir.up do
          t.integer :ingredient_subscription, null: false, default: 0
          # Remove `default: 0` after this migration
        end
        dir.down do
          t.remove :ingredient_subscription
        end
      end
    end
  end
end
