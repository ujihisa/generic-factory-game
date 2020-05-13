Rails.application.routes.draw do
  get 'games/highscore'

  resources :games do
    member do
      post 'create_storages'

      get 'new_employee'
      post 'create_employee'

      get 'new_dispatch'
      post 'create_dispatch'

      post 'buy_ingredients'
      post 'subscribe_ingredients'

      post 'end_month'

      post 'borrow_money'

      post 'force_change' if Rails.env.development?
    end
    resources :factories
    resources :contracts, only: [:create]
  end

  resources :players
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root 'home#index'
end
