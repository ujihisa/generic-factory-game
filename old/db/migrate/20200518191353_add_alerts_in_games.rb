class AddAlertsInGames < ActiveRecord::Migration[6.0]
  def change
    change_table :games do |t|
      t.text :alerts_raw, null: false, default: '[]'
    end
  end
end
