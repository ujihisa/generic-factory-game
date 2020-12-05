require 'test_helper'

class GameTest < ActiveSupport::TestCase
  test 'save' do
    game = games(:playing)
    assert game.save
  end

  test 'debt' do
    game = games(:playing)
    game.assign_attributes(cash: 100, money: 100)
    assert_equal 0, game.debt

    game.debt = 100
    assert_equal 10, game.debt
    assert_equal 90, game.money
  end

  test 'cash' do
    game = games(:playing)
    game.assign_attributes(cash: 100, money: 100)
    assert_equal 0, game.debt

    game.cash = 200
    assert_equal 200, game.money
  end

  test 'status' do
    game = games(:playing)

    assert_equal :in_progress, game.status

    game.assign_attributes(cash: 100, money: 0)
    assert_equal :in_progress, game.status

    game.assign_attributes(cash: 0, money: 0)
    assert_equal :in_progress, game.status

    game.assign_attributes(cash: 1200, money: 800)
    assert_equal :in_progress, game.status

    game.assign_attributes(cash: -5, money: -5)
    assert_equal :game_over, game.status

    game.assign_attributes(cash: -5, money: 100)
    assert_equal :game_over, game.status

    game.assign_attributes(cash: 1000, money: 1000)
    assert_equal :completed, game.status

    game.assign_attributes(cash: 1300, money: 1200)
    assert_equal :completed, game.status
  end

  test 'interest' do
    game = games(:playing)
    assert_equal 9.0, game.interest
  end

  test 'max_debt' do
    game = games(:playing)
    assert_equal 100, game.max_debt
  end
end
