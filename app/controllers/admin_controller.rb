class AdminController < ApplicationController
  before_action 
  before_action :admin_only

  def index
    respond_to do |format|
      format.html
      format.json do
        json = {
          tutorials: Game.latest.where(
            version: GenericFactoryGame::VERSION,
            mode: 'tutorial'
          ).order(updated_at: :desc).includes(:player).as_json(include: :player),
        }
        render json: json
      end
    end
  end

  private def admin_only
    if Admin.exists?(user_id: current_user&.id)
      # ok
    else
      redirect_to root_path, alert: "You aren't an admin"
    end
  end
end
