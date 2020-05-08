Rails.application.routes.draw do
  get 'games/highscore'

  resources :games do
    member do
      get 'new_storages'
      post 'create_storages'

      get 'new_employee'
      post 'create_employee'

      get 'new_dispatch'
      post 'create_dispatch'

      get 'new_ingredients'
      post 'create_ingredients'

      post 'end_month'

      post 'borrow_money'
    end
    resources :factories
    resources :contracts
  end

  resources :players
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root 'home#index'
end
