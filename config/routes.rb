Rails.application.routes.draw do
  resources :patients
  resources :reviewers
  
  ##get '/public/GSE21976_CACO2_BIFIDOBACTERIUM_BIFIDUM_TREAMENT_2H.TXT.xls' => 'patients#index'
  root 'patients#home'
  get '/home' => 'patients#home'
  get '/analysis' => 'patients#index'
  get '/error' => 'patients#new'
  get '/patients/:job' => 'patients#show'
  post '/' => 'patients#create'
  get '/query_results' => 'patients#query_results'
  get '/scatter' => 'patients#scatter'
  post '/heatmap'=> 'patients#heatmap'
  get '/help' => 'patients#edit'
  get '/download/:job/:archivo1' => 'patients#download'
  get '/search' => 'patients#search'
  get '/enrichment/:job/:archivo1' => 'patients#enrichment'   

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes". Time.now.to_f.to_s

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :s
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
