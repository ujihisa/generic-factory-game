class ContractsController < ApplicationController
  def create
    # @contract = Contract.new(game_id: params[:game_id], **contract_params)
    @game = Game.find(params[:game_id])

    # TODO: Move them into model validation
    if @game.signed_contracts.include?(params[:name])
      return redirect_to(@game, notice: '[ERROR] You already have that contract')
    elsif !Contract.find(name: params[:name])
      return redirect_to(@game, notice: '[ERROR] Invalid contract name')
    elsif @game.credit < Contract.find(name: params[:name]).required_credit
      return redirect_to(@game, notice: '[ERROR] Not enough credit')
    end
    @game.signed_contracts += [params[:name]]

    if @game.save
      redirect_to @game, notice: 'Contract was successfully signed.'
    else
      redirect_to @game, alert: "[ERROR] #{@game.errors}"
    end
  end

  # Only allow a list of trusted parameters through.
  private def contract_params
    params.require(:contract).permit(:game_id, :name)
  end
end
