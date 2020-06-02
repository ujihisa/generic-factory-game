Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
  }

  get 'games/highscore'

  resources :games, except: [:edit, :update] do
    member do
      post 'create_storages'

      post 'buy_ingredients'
      post 'subscribe_ingredients'

      post 'end_month'

      post 'borrow_money'

      post 'force_change' if Rails.env.development?

      post 'hire'
      post 'advertise'
      post 'factory_assign'
      post 'factory_buyinstall'

      post 'contracts/cancel', to: 'contracts#cancel'
      post 'contracts/create', to: 'contracts#create'
    end

    resources :contracts, only: [:create]
  end

  resources :players, only: [:new, :create]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root 'home#index'
end
