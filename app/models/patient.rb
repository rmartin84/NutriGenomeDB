class Patient < ActiveRecord::Base
	validates :name, presence: true
end
