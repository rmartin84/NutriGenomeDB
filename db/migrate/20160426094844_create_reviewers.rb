class CreateReviewers < ActiveRecord::Migration
  def change
    create_table :reviewers do |t|
      t.string :names
      t.string :last_name

      t.timestamps null: false
    end
  end
end
