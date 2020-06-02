require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  test 'save' do
    player = Player.new(name: 'aaa')
    assert player.save
  end
end
