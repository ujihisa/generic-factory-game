class AddEmployeeGroupsRawInGames < ActiveRecord::Migration[6.0]
  def change
    reversible do |dir|
      change_table :games do |t|
        dir.up do
          t.text :employee_groups_raw, null: false, default: '{}'
          # Fill from assignments_raw
          Game.find_each do |game|
            game.employee_groups_raw =
              game.assignments.to_h {|a| [a.employee_group_name, a.num] }.to_json
            game.save!
          end
        end
        dir.down do
          t.remove :employee_groups_raw
        end
      end
    end
  end
end
