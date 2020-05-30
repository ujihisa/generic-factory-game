class GamesController < ApplicationController
  before_action :game_with_user, only: [
    :create_storages, :buy_ingredients, :borrow_money, :subscribe_ingredients,
    :end_month, :hire, :factory_assign, :factory_buyinstall, :advertise,
  ]

  # GET /games
  # GET /games.json
  def index
    @current_games = Game.latest.where(version: GenericFactoryGame::VERSION, mode: ['easy', 'normal']).order(updated_at: :desc)
    @archived_games = Game.latest.where.not(version: GenericFactoryGame::VERSION).order(version: :desc, updated_at: :desc)
  end

  def highscore
    @games = {
      'easy' => Game.best_games(GenericFactoryGame::VERSION, 'easy'),
      'normal' => Game.best_games(GenericFactoryGame::VERSION, 'normal'),
    }
    @old_games = Game.best_games(GenericFactoryGame::PREVIOUS_VERSION, 'normal')
  end

  # GET /games/1
  # GET /games/1.json
  def show
    @game = Game.find(params[:id])
    @estimate = Game.find(params[:id]).tap do |game|
      game.settlement()
    end
  end

  # GET /games/new
  def new
    @game = Game.new
    @players = Player.all.reject(&:user)
  end

  # POST /games
  # POST /games.json
  def create
    @game = Game.new(
      version: GenericFactoryGame::VERSION,
      ingredient_subscription: 0,
      **game_params)
    if @game.player.user && @game.player.user != current_user
      return redirect_to :new_game, alert: 'Invalid game/user'
    end

    case @game.mode
    when 'tutorial'
      @game.cash = 999
      @game.storage = 200
      @game.ingredient = 100
      @game.ingredient_subscription = 100
      @game.equipments = [Factory.lookup(equipment_name: :'Factory base')]
      @game.assignments = [Assignment.new(:produce, :Intermediate, 4)]
      @game.employee_groups_raw = {'Intermediate' => 4}.to_json
      @game.signed_contracts = {'Tutorial': -2}

      @game.messages = <<~EOS.lines.to_a
        Welcome to GenericFactoryGame!
        In this tutorial I'd love you to understand "End month" before starting actual game.
        Try clicking random places and make sure the "End month" button does not show the red warning, and then click it. That's it!

        The goal of this game is to achieve 1 million dollars. ($1,000K)

        このチュートリアルではGenericFactoryGameの一部の振る舞いについて軽く触れて、ひとまず「End month」を完全に理解してもらいます。
        いろんなボタンを推したりしてみて、とにかく左下の"End month"のボタンの赤い警告をなくして、それからそれを押してみてください。それだけでいけるはずです!

        このゲームのクリア条件は、資産を$1,000Kにすることです。 (資産=現金-借金)
      EOS
    when 'easy'
      @game.cash = 300
      @game.messages = ['You started your own business from nothing but $300K.']
    else # 'normal'
      @game.cash = 0
      @game.credit = 10
      @game.storage = 100
      @game.ingredient = 20
      @game.ingredient_subscription = 20
      @game.quality = 10
      @game.assignments = [Assignment.new(:produce, :Senior, 1)]
      @game.employee_groups_raw = {'Senior' => 1}.to_json
      @game.equipments = [Factory.lookup(equipment_name: :'Factory base')]
      @game.signed_contracts = {'K': -2}
    end
    @players = Player.all.reject(&:user)

    if @game.save
      redirect_to @game, alert: @game.messages.join("\n")
    else
      render :new
    end
  end

  def create_storages
    storage = params[:storage].to_i
    @game = Game.find(params[:id])

    diff = storage - @game.storage
    @game.cash -= diff / 100
    @game.storage = storage

    if diff <= 0
      redirect_to @game, alert: "[ERROR] Missing storage"
    elsif 0 <= @game.cash && @game.save
      redirect_to @game, notice: "Successfully Bought #{diff}t Storages"
    else
      redirect_to @game, alert: "Failed to buy Storages: #{@game.errors.messages}"
    end
  end

  def buy_ingredients
    vol = params[:vol].to_i
    @game = Game.find(params[:id])
    @game.cash -= vol * 0.25
    @game.ingredient += vol
    if 0 <= @game.cash && @game.save
      redirect_to @game, notice: "Successfully Bought #{vol}t Ingredients"
    else
      redirect_to @game, alert: "Failed to buy Ingredients"
    end
  end

  def subscribe_ingredients
    if @game.credit < 10
      return redirect_to @game, alert: 'Not enough credit!'
    end

    before = @game.ingredient_subscription.to_i
    after = params[:ingredient_subscription].to_i

    change_fee = [(after - before) * 0.1, 0].max
    @game.cash -= change_fee
    @game.ingredient_subscription = after

    if 0 <= @game.cash && @game.save
      if 0 < before
        redirect_to @game, notice: "Successfully changed subscription to #{after - before}t Ingredients"
      else
        redirect_to @game, notice: "Successfully Subscribed #{after}t Ingredients"
      end
    else
      redirect_to @game, alert: "Failed to Subscribed Ingredients"
    end
  end

  def end_month
    @game = Game.find(params[:id])

    @game.settlement()

    if @game.save
      if @game.cash < 0
        redirect_to @game, notice: 'Game over!'
      elsif 1000 <= @game.cash
        redirect_to @game, notice: 'Game clear!'
      elsif @game.month % 12 == 0
        redirect_to @game, alert: "It's #{2020 + @game.month / 12}. Happy new year!"
      else
        redirect_to @game
      end
    else
      redirect_to @game, alert: "Hmm. something was wrong... #{@game.errors.messages}"
    end
  end

  def borrow_money
    new_debt = params[:debt].to_i
    if @game.credit * 10 < new_debt
      return redirect_to @game, alert: "You can't borrow cash more than your credit * 10"
    end

    @game.cash += new_debt - @game.debt
    @game.debt = new_debt

    if @game.cash < 0
      return redirect_to @game, alert: "Not enough cash"
    end

    if @game.save
      redirect_to @game, notice: 'Borrow/Pay succeeded'
    else
      redirect_to @game, alert: 'Borrow/Pay failed'
    end
  end

  def hire
    # num_employees: {"Junior"=>2, "Intermediate"=>0, "Senior"=>0}
    num_employees = JSON.parse(params[:num_employees_json])

    num_paid =
      @game.organization_hire(
        num_employees.to_h {|k, v| [k.to_sym, v.to_i] })
    if @game.save
      redirect_to @game, notice: "Successfully hired employees. Paid $#{num_paid}K for recruiting them."
    else
      redirect_to @game, alert: "Failed to hire: #{@game.errors.messages}"
    end
  end

  def factory_assign
    # num_role_diffs_json: {"Junior":{"produce":0,"mentor":0}}
    num_role_diffs = JSON.parse(params[:num_role_diffs_json])
    num_role_diffs.each do |eg_name, diffs|
      @game.factory_assign_add(eg_name.to_sym, **diffs.to_h { [_1.to_sym, _2.to_i] })
    end
    if @game.save
      redirect_to @game, notice: 'Successfully assigned tasks'
    else
      redirect_to @game, alert: "Failed to assign: #{@game.errors.messages}"
    end
  end

  def factory_buyinstall
    equipment = Factory.lookup(equipment_name: params[:equipmentRadios])
    return redirect_to @game, alert: "Invalid equipment_name #{params[:equipmentRadios]}" unless equipment

    @game.buyinstall_equipment(equipment)
    if @game.cash < 0
      redirect_to @game, alert: 'Not enough money'
    elsif @game.save
      redirect_to @game, notice: "#{params[:equipmentRadios]} has been installed into your factory."
    else
      redirect_to @game, alert: "#{@game.errors.messages}"
    end
  end

  if Rails.env.development?
    def force_change
      @game = Game.find(params[:id])
      if @game.update(params.permit(:cash, :debt, :credit, :storage, :product, :quality, :ingredient))
        redirect_to @game, notice: 'GOOD GOOD'
      else
        redirect_to @game, alert: "#{@game.errors.messages}"
      end
    end
  end

  private def game_with_user
    @game = Game.latest.find(params[:id])

    if @game.player.user && @game.player.user != current_user
      redirect_to :new_game, alert: 'Invalid game/user'
    end
  end

  private def game_params
    params.require(:game).permit(:player_id, :mode)
  end

  def advertise
    if @game.credit < 10
      return redirect_to @game, alert: 'Not enough credit to advertise'
    end

    @game.cash -= 100

    if @game.cash < 0
      return redirect_to @game, alert: 'Not enough cash to advertise'
    end

    if @game.advertising
      return redirect_to @game, alert: "You can't advertise more than once a month"
    end

    @game.advertising = true
    if @game.save
      redirect_to @game, notice: "You succeeded in advertizing yourself in this month."
    else
      redirect_to @game, alert: "Failed to advertise. #{@game.errors.messages}"
    end
  end
end
