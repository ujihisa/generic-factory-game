require 'test_helper'

class ContractsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @game = games(:playing)
  end

  test "should create contract" do
    post contracts_create_game_url(@game.id), params: { name: 'NormalA' }

    assert_redirected_to game_url(@game.id)
    assert_equal '{"NormalA":2}', @game.reload.signed_contracts.to_json
  end

  # test "should update contract" do
  #   patch contract_url(@contract), params: { contract: { game_id: @contract.game_id, name: @contract.name } }
  #   assert_redirected_to contract_url(@contract)
  # end
end
