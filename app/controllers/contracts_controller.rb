class ContractsController < ApplicationController
  def create
    # @contract = Contract.new(game_id: params[:game_id], **contract_params)
    @game = Game.find(params[:game_id])
    contract = Contract.find(name: params[:name])

    @game.signed_contracts += [contract]

    if @game.save
      redirect_to @game, notice: 'Contract was successfully signed.'
    else
      redirect_to @game, alert: "Failed to sign the contract: #{@game.errors.messages}"
    end
  end

  # Only allow a list of trusted parameters through.
  private def contract_params
    params.require(:contract).permit(:game_id, :name)
  end
end
