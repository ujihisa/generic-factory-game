class Factory < ApplicationRecord
  belongs_to :game
  validates :name, inclusion: ['idle', 'manual', 'semi-auto', 'full-auto']
  validates_uniqueness_of :name, scope: :game_id

  COST_TO_BUY = {
    'idle': 0,
    'manual': 0,
    'semi-auto': 90,
    'full-auto': 200,
  }.freeze

  # performance = α * #ES + β * ΣES
  PERFORMANCE_A_B = {
    'idle': [0, 0],
    'manual': [0, 1],
    'semi-auto': [30, 0.5],
    'full-auto': [70, 0],
  }

  # The amount how much you consume the ingredient.
  def performance
    (a, b) = PERFORMANCE_A_B[name.to_sym]

    a * (junior + intermediate + senior) +
      b * (junior * Employee::SKILLS[:junior] +
           intermediate * Employee::SKILLS[:intermediate] +
           senior * Employee::SKILLS[:senior])
  end
end
