class CreateAdmin < ActiveRecord::Migration[6.0]
  class Admin < ApplicationRecord
  end

  def change
    create_table :admins do |t|
      t.references :user, null: false, index: {unique: true}
      t.timestamps
    end

    reversible do |dir|
      dir.up do
        if user = User.first
          Admin.create!(user_id: user.id)
        end
      end
    end

    change_table :darklaunches do |t|
      t.timestamps default: Time.now
    end
  end
end
