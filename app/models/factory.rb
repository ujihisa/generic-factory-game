# frozen_string_literal: true

class Factory
  EQUIPMENTS = {
    None: {
      cost: 0,
      production: [-9, -18, -18],
      quality: [-18, -18, -36],
      description: "Default",
    }.freeze,
    Workbench: {
      cost: 10,
      production: [0, 0, 0],
      quality: [0, 0, 0],
      description: "A place to work on crafting. It's hard to produce anything without this.",
    }.freeze,
    Conveyor: {
      cost: 100,
      production: [10, 10, 10],
      quality: [0, 0, 0],
      description: "Now staff don't have to walk around, but stuff walk around instead.",
    }.freeze,
    'Advanced toolsets': {
      cost: 100,
      production: [0, 5, 10],
      quality: [0, 5, 10],
      description: "Leverage skilled craftspersons. Advanced people need advanced tools.",
    }.freeze,
    'Free space': {
      cost: 100,
      production: [-5, -5, -5],
      quality: [20, 20, 20],
      description: "Enjoy your relaxed time",
    }.freeze,
    'Computers': {
      cost: 100,
      production: [0, 0, 0],
      quality: [10, 10, 10],
      description: "Enjoy your relaxed time",
    }.freeze,
    'Machines': {
      cost: 100,
      production: [0, 0, 0],
      quality: [0, 0, 0],
      description: "Industrialization",
    }.freeze,
    'Anormal detector': {
      cost: 100,
      production: [0, 0, 0],
      quality: [20, 20, 0],
      description: "It has better eyes than human's",
    }.freeze,
    'Fullauto machines': {
      cost: 200,
      production: [25, 15, 10],
      quality: [10, 10, 10],
      description: "Let the machines do all the jobs",
    }.freeze,
  }.freeze

  def initialize(equipments, dispatches)
    @equipments = equipments
    @dispatches = dispatches
    freeze
  end

  def production_volume
    @dispatches.sum { production_vol(_1, @equipments) }
  end

  private def production_vol(d, equipments)
    case d.role
    when :mentor
      0
    when :produce
      if 0 < d.num
        d.num * (
          EmployeeGroup.lookup(d.employee_group_name).volume +
          equipments.map {|equipment| equipment[:production][0] }.sum)
      else
        0
      end
    else
      raise "Invalid role: #{d.role.inspect}"
    end
  end
end
