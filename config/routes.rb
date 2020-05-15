Rails.application.routes.draw do
  get 'games/highscore'

  resources :games do
    member do
      post 'create_storages'

      post 'buy_ingredients'
      post 'subscribe_ingredients'

      post 'end_month'

      post 'borrow_money'

      post 'force_change' if Rails.env.development?

      post 'hire'
      post 'factory_assign'
      post 'factory_buyinstall'
    end

    resources :contracts, only: [:create]
  end

  resources :players
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root 'home#index'
end
