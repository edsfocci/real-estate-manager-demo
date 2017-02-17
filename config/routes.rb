Rails.application.routes.draw do
  root 'static_pages#home'
  devise_for :users, controllers: { sessions:       'sessions',
                                    registrations:  'registrations' }

  resources 'subscriptions',  defaults: { format: :json }, only: :update
  resources 'properties',     defaults: { format: :json },
                                              only: [:create, :update, :destroy]

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
