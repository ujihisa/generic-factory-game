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

  EQUIPMENTS = {
    None: {
      cost: 0,
      production: [-9, -18, -18],
      quality: [-18, -18, -36],
      description: "Default",
    },
    Workbench: {
      cost: 10,
      production: [0, 0, 0],
      quality: [0, 0, 0],
      description: "A place to work on crafting. It's hard to produce anything without this.",
    },
    Conveyor: {
      cost: 100,
      production: [10, 10, 10],
      quality: [0, 0, 0],
      description: "Now staff don't have to walk around, but stuff walk around instead.",
    },
    'Advanced toolsets': {
      cost: 100,
      production: [0, 5, 10],
      quality: [0, 5, 10],
      description: "Leverage skilled craftspersons. Advanced people need advanced tools.",
    },
    'Free space': {
      cost: 100,
      production: [-5, -5, -5],
      quality: [20, 20, 20],
      description: "Enjoy your relaxed time",
    },
    'Computers': {
      cost: 100,
      production: [0, 0, 0],
      quality: [10, 10, 10],
      description: "Enjoy your relaxed time",
    },
    'Machines': {
      cost: 100,
      production: [0, 0, 0],
      quality: [0, 0, 0],
      description: "Industrialization",
    },
    'Anormal detector': {
      cost: 100,
      production: [0, 0, 0],
      quality: [20, 20, 0],
      description: "It has better eyes than human's",
    },
    'Fullauto machines': {
      cost: 200,
      production: [25, 15, 10],
      quality: [10, 10, 10],
      description: "Let the machines do all the jobs",
    },
  }

  # The amount how much you consume the ingredient.
  def performance
    999 # dummy
    # (a, b) = PERFORMANCE_A_B[name.to_sym]
    #
    # a * (junior + intermediate + senior) +
    #   b * (junior * Employee::SKILLS[:junior] +
    #        intermediate * Employee::SKILLS[:intermediate] +
    #        senior * Employee::SKILLS[:senior])
  end
end
