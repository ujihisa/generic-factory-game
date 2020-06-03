require 'test_helper'

class PlayersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @player = players(:ujihisa)
  end

  test "should get new" do
    get new_player_url
    assert_response :success
  end

  test "should create player" do
    assert_difference('Player.count') do
      post players_url, params: { player: { name: 'adsfjkljasdlf' } }
    end

    assert_redirected_to new_user_registration_path(player_id: Player.last.id)
  end
end
