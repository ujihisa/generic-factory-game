class SplitVersion < ActiveRecord::Migration[6.0]
  class Game < ApplicationRecord; end

  def up
    change_table :games do |t|
      t.rename :version, :version_major
      t.string :version_patch
    end

    Game.where(version_major: '1.0.0').find_each do |game|
      game.version_major = '1.0'
      game.version_patch = '0'
      game.save!(touch: false, validate: false)
    end
  end

  def down
    Game.where(version_major: '1.0').find_each do |game|
      game.version_major = '1.0.0'
      game.save!(touch: false, validate: false)
    end

    change_table :games do |t|
      t.remove :version_patch
      t.rename :version_major, :version
    end
  end
end
