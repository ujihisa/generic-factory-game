require 'test_helper'

class FactoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @factory = factories(:one)
  end

  test "should get index" do
    get factories_url
    assert_response :success
  end

  test "should get new" do
    get new_factory_url
    assert_response :success
  end

  test "should create factory" do
    assert_difference('Factory.count') do
      post factories_url, params: { factory: { game_id: @factory.game_id, intermediate: @factory.intermediate, junior: @factory.junior, name: @factory.name, senior: @factory.senior } }
    end

    assert_redirected_to factory_url(Factory.last)
  end

  test "should show factory" do
    get factory_url(@factory)
    assert_response :success
  end

  test "should get edit" do
    get edit_factory_url(@factory)
    assert_response :success
  end

  test "should update factory" do
    patch factory_url(@factory), params: { factory: { game_id: @factory.game_id, intermediate: @factory.intermediate, junior: @factory.junior, name: @factory.name, senior: @factory.senior } }
    assert_redirected_to factory_url(@factory)
  end

  test "should destroy factory" do
    assert_difference('Factory.count', -1) do
      delete factory_url(@factory)
    end

    assert_redirected_to factories_url
  end
end
