require 'test_helper'

class GameTest < ActiveSupport::TestCase
  test 'save' do
    game = Game.new(
      player_id: players(:ujihisa).id,
      month: 0,
      cash: 10,
      storage: 0,
      ingredient: 0,
      product: 0,
      version: '1.0.0',
      credit: 0,
      money: 0,
      ingredient_subscription: 0,
      messages_raw: '[]',
      portfolios_raw: '[]',
      equipment_names_raw: '[]',
      quality: 0.0,
      mode: 'normal',
      advertising: false,
      employee_groups_raw: '{}',
      alerts_raw: '[]',
    )
    assert game.save
  end
end
