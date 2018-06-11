class CreatePatients < ActiveRecord::Migration
  def change
    create_table :patients do |t|
      t.integer :age
      t.string :gender
      t.integer :weight
      t.string :city
      t.string :number_of

      t.timestamps null: false
    end
  end
end
