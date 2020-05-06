require "application_system_test_case"

class GamesTest < ApplicationSystemTestCase
  setup do
    @game = games(:one)
  end

  test "visiting the index" do
    visit games_url
    assert_selector "h1", text: "Games"
  end

  test "creating a Game" do
    visit games_url
    click_on "New Game"

    fill_in "Ingredient", with: @game.ingredient
    fill_in "Money", with: @game.money
    fill_in "Month", with: @game.month
    fill_in "Player", with: @game.player
    fill_in "Product", with: @game.product
    fill_in "Storage", with: @game.storage
    click_on "Create Game"

    assert_text "Game was successfully created"
    click_on "Back"
  end

  test "updating a Game" do
    visit games_url
    click_on "Edit", match: :first

    fill_in "Ingredient", with: @game.ingredient
    fill_in "Money", with: @game.money
    fill_in "Month", with: @game.month
    fill_in "Player", with: @game.player
    fill_in "Product", with: @game.product
    fill_in "Storage", with: @game.storage
    click_on "Update Game"

    assert_text "Game was successfully updated"
    click_on "Back"
  end

  test "destroying a Game" do
    visit games_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Game was successfully destroyed"
  end
end
