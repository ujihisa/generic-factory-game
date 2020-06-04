class AdminController < ApplicationController
  before_action 
  before_action :admin_only

  def index
  end

  private def admin_only
    if Admin.exists?(user_id: current_user&.id)
      # ok
    else
      redirect_to root_path, alert: "You aren't an admin"
    end
  end
end
