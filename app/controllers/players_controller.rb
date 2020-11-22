class PlayersController < ApplicationController
  # GET /players/new
  def new
    @player = Player.new
  end

  # POST /players
  # POST /players.json
  def create
    @player = Player.new(player_params)

    if @player.save
      redirect_to new_user_registration_path(player_id: @player.id), notice: "Player #{@player.name} was successfully created."
    else
      render :new
    end
  end

  private

    # Only allow a list of trusted parameters through.
    def player_params
      params.require(:player).permit(:name)
    end
end
