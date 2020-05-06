class ContractsController < ApplicationController
  def new
    @contract = Contract.new
    @game = Game.find(params[:game_id])
  end

  def create
    @contract = Contract.new(game_id: params[:game_id], **contract_params)
    @game = Game.find(params[:game_id])

    if @contract.save
      redirect_to @game, notice: 'Contract was successfully made.'
    else
      render :new
    end
  end

  private
    # Only allow a list of trusted parameters through.
    def contract_params
      params.require(:contract).permit(:game_id, :name)
    end
end
