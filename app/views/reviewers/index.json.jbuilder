json.array!(@reviewers) do |reviewer|
  json.extract! reviewer, :id, :name, :last_name
  json.url reviewer_url(reviewer, format: :json)
end
