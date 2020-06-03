#!bin/rails test

require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  test 'save' do
    player = Player.new(name: 'aaa')
    assert player.save
  end

  test 'completed?' do
    player = players(:ujihisa)
    assert_not player.completed?('1.0.0', 'normal')

    game = player.games.first
    game.update!(version: '1.0.0', mode: 'normal', money: 1023)
    assert player.completed?('1.0.0', 'normal')
  end
end
