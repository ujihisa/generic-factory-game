class ChangeVersionFromPatchToMinor < ActiveRecord::Migration[6.0]
  def up
    Game.where(version: '0.0.1').update_all(version: '0.1.0')
    Game.where(version: '0.0.2').update_all(version: '0.2.0')
  end

  def down
    raise 'not implemented'
  end
end
