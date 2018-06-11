json.array!(@patients) do |patient|
  json.extract! patient, :id, :age, :gender, :weight, :city, :number_of
  json.url patient_url(patient, format: :json)
end
