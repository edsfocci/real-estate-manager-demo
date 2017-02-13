Rails.application.routes.draw do
  root 'static_pages#home'
  devise_for :users, controllers: { sessions:       'sessions',
                                    registrations:  'registrations' }
  # namespace :api, defaults: { format: :json } do
  #   resources 'subscriptions'
  #   resources 'properties'
  # end
  resources 'subscriptions', defaults: { format: :json }
  resources 'properties', defaults: { format: :json }

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
