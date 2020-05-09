class IngredientDelivery < ApplicationRecord
  belongs_to :game

  COST_PER_VOL = {
    1 => 0.5,
    2 => 0.1,
    3 => 0.05
  }.freeze
end
