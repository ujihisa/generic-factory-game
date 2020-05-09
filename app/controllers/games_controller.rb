class GamesController < ApplicationController
  before_action :set_game, only: [
    :show, :edit, :update, :destroy, :new_storages, :create_storages,
    :new_employee, :create_employee, :new_dispatch, :create_dispatch,
    :buy_ingredients, :end_month, :borrow_money, :subscribe_ingredients,
  ]

  # GET /games
  # GET /games.json
  def index
    @current_games = Game.where(version: GenericFactoryGame::VERSION).order(updated_at: :desc)
    @archived_games = Game.where.not(version: GenericFactoryGame::VERSION).order(version: :desc, updated_at: :desc)
  end

  def highscore
    @games = Game.best_games(GenericFactoryGame::VERSION)
    @old_games = Game.best_games(GenericFactoryGame::PREVIOUS_VERSION)
  end

  # GET /games/1
  # GET /games/1.json
  def show
    @estimate = Game.find(@game.id).tap do |game|
      game.settlement()
    end
  end

  # GET /games/new
  def new
    @game = Game.new
    @players = Player.all
  end

  # GET /games/1/edit
  def edit
  end

  # POST /games
  # POST /games.json
  def create
    @game = Game.new(
      version: GenericFactoryGame::VERSION,
      ingredient_subscription: 0,
      **game_params)
    @players = Player.all

    respond_to do |format|
      if @game.save && Factory.create(game_id: @game.id, name: 'idle')
        format.html { redirect_to @game, notice: 'Game start!' }
        format.json { render :show, status: :created, location: @game }
      else
        format.html { render :new }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /games/1
  # PATCH/PUT /games/1.json
  def update
    respond_to do |format|
      if @game.update(game_params)
        format.html { redirect_to @game, notice: 'Game was successfully updated.' }
        format.json { render :show, status: :ok, location: @game }
      else
        format.html { render :edit }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  def new_storages
  end

  def create_storages
    num = params[:num].to_i
    @game = Game.find(params[:id])
    @game.cash -= num
    @game.storage += 100 * num
    if 0 <= @game.cash && @game.save
      redirect_to @game, notice: "Successfully Bought #{num * 100}t Storages"
    else
      redirect_to @game, notice: "Failed to buy Storages"
    end
  end

  def new_employee
  end

  def create_employee
    @game = Game.find(params[:id])

    if @game.hire(params[:type].to_sym)
      redirect_to @game, notice: "Successfully hired the #{params[:type]} employee"
    else
      redirect_to @game, notice: "Failed to hire the employee"
    end
  end

  def new_dispatch
  end

  def create_dispatch
    raise unless params[:id] && params[:type] && params[:from] && params[:to]

    from = Factory.where(game_id: params[:id], name: params[:from]).first
    to = Factory.where(game_id: params[:id], name: params[:to]).first
    raise 'must not happen' unless from && to

    num = params[:num].to_i
    raise 'Must not happen' if num == 0

    success =
      case params[:type]
      when 'junior'
        if num <= from.junior
          from.junior -= num
          to.junior += num
          from.save && to.save
        end
      when 'intermediate'
        if num <= from.intermediate
          from.intermediate -= num
          to.intermediate += num
          from.save && to.save
        end
      when 'senior'
        if num <= from.senior
          from.senior -= num
          to.senior += num
          from.save && to.save
        end
      else
        raise 'must not happen'
      end

    if success
      redirect_to @game, notice: "Successfully dispatched the #{params[:type]} employee to #{params[:to]}"
    else
      redirect_to @game, notice: "Failed to dispatch the employee"
    end
  end

  def buy_ingredients
    vol = params[:vol].to_i
    @game = Game.find(params[:id])
    @game.cash -= vol * 0.5
    @game.ingredient += vol
    if 0 <= @game.cash && @game.save
      redirect_to @game, notice: "Successfully Bought #{vol}t Ingredients"
    else
      redirect_to @game, notice: "Failed to buy Ingredients"
    end
  end

  def subscribe_ingredients
    before = @game.ingredient_subscription.to_i
    after = params[:ingredient_subscription].to_i

    change_fee = [(after - before) * 0.05, 0].max
    @game.cash -= change_fee
    @game.ingredient_subscription = after

    if 0 <= @game.cash && @game.save
      if 0 < before
        redirect_to @game, notice: "Successfully changed subscription to #{after - before}t Ingredients"
      else
        redirect_to @game, notice: "Successfully Subscribed #{after}t Ingredients"
      end
    else
      redirect_to @game, notice: "Failed to Subscribed Ingredients"
    end
  end

  def end_month
    messages = @game.settlement()
    @game.set_history(@game.month, messages)

    if @game.save
      if @game.cash < 0
        messages << 'Game over!'
        redirect_to @game, notice: messages.join(",\n")
      elsif 1000 <= @game.cash
        messages << 'Game clear!'
        redirect_to @game, notice: messages.join(",\n")
      else
        messages << 'Successfully ended the month'
        redirect_to @game, notice: messages.join(",\n")
      end
    else
      redirect_to @game, notice: 'Hmm. something was wrong...'
    end
  end

  def borrow_money
    new_debt = params[:debt].to_i
    if @game.credit * 10 < new_debt
      return redirect_to @game, notice: "[ERROR] You can't borrow cash more than your credit * 10"
    end

    @game.cash += new_debt - @game.debt
    @game.debt = new_debt

    if @game.cash < 0
      return redirect_to @game, notice: "[ERROR] Not enough cash"
    end

    if @game.save
      redirect_to @game, notice: 'Borrow/Pay succeeded'
    else
      redirect_to @game, notice: '[ERROR] Borrow/Pay failed'
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def game_params
      params.require(:game).permit(:player_id)
    end
end
