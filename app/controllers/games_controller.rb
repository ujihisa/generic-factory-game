class GamesController < ApplicationController
  before_action :set_game, only: [
    :show, :edit, :update, :destroy, :new_storages, :create_storages,
    :new_employee, :create_employee, :new_dispatch, :create_dispatch,
  ]

  # GET /games
  # GET /games.json
  def index
    @games = Game.all
  end

  # GET /games/1
  # GET /games/1.json
  def show
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
    @game = Game.new(game_params)
    @players = Player.all

    respond_to do |format|
      if @game.save && Factory.create(game_id: @game.id, name: 'idle')
        format.html { redirect_to @game, notice: 'Game was successfully created.' }
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
    @game.money -= 1
    @game.storage += 100
    if 0 <= @game.money && @game.save
      redirect_to @game, notice: "Successfully Bought #{num * 100}t Storages"
    else
      redirect_to @game, notice: "Failed to buy Storages"
    end
  end

  def new_employee
  end

  def create_employee
    @game = Game.find(params[:id])
    @factory = Factory.where(game_id: params[:id], name: 'idle').first
    raise 'Must not happen' unless @factory

    case params[:type]
    when 'junior'
      @factory.junior += 1
    when 'intermediate'
      @factory.intermediate += 1
    when 'senior'
      @factory.senior += 1
    else
      raise 'Must not happen'
    end

    if @factory.save
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

    success =
      case params[:type]
      when 'junior'
        if 0 < from.junior
          from.junior -= 1
          to.junior += 1
          from.save && to.save
        end
      when 'intermediate'
        if 0 < from.intermediate
          from.intermediate -= 1
          to.intermediate += 1
          from.save && to.save
        end
      when 'senior'
        if 0 < from.senior
          from.senior -= 1
          to.senior += 1
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
