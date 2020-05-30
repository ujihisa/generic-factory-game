class ContractsController < ApplicationController
  before_action :game_with_user

  def create
    # @contract = Contract.new(game_id: params[:game_id], **contract_params)

    @game.signed_contracts.sign(@game.month, params[:name])

    if @game.save
      redirect_to @game, notice: 'Contract was successfully signed.'
    else
      redirect_to @game, alert: "Failed to sign the contract: #{@game.errors.messages}"
    end
  end

  def cancel
    @game = Game.find(params[:id])
    @game.signed_contracts.cancel(@game.month)

    if @game.save
      redirect_to @game, notice: 'Cooling off cancellation was successfully signed.'
    else
      redirect_to @game, alert: "Failed to make a cooling off cancellation: #{@game.errors.messages}"
    end
  end

  # Only allow a list of trusted parameters through.
  private def contract_params
    params.require(:contract).permit(:game_id, :name)
  end

  private def game_with_user
    @game = Game.find(params[:id])

    if @game.player.user && @game.player.user != current_user
      redirect_to :new_game, alert: 'Invalid game/user'
    end
  end
end
