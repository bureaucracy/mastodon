class AddQuizToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :quiz, :string
  end
end
