# frozen_string_literal: true

class Factory
  EQUIPMENTS = {
    'Factory base': {
      install: 10,
      cost: 5,
      production: [0, 0, 0],
      quality: [0, 0, 0],
      description: "It doesn't help you producing but without it you can't produce anything.",
    }.freeze,
    Conveyor: {
      install: 100,
      cost: 10,
      production: [10, 10, 10],
      quality: [0, 0, 0],
      description: "Now staff don't have to walk around, but stuff walk around instead.",
    }.freeze,
    'Advanced toolsets': {
      install: 100,
      cost: 0,
      production: [0, 5, 10],
      quality: [0, 5, 10],
      description: "Leverage skilled craftspersons. Advanced people need advanced tools.",
    }.freeze,
    'Free space': {
      install: 100,
      cost: 0,
      production: [-5, -5, -5],
      quality: [20, 20, 20],
      description: "Enjoy your relaxed time",
    }.freeze,
    'Computers': {
      install: 100,
      cost: 5,
      production: [0, 0, 0],
      quality: [10, 10, 10],
      description: "Helps you archtechting, designing, sharing knowledge, and many more",
    }.freeze,
    'Semiauto machines': {
      install: 100,
      cost: 10,
      production: [10, 10, 10],
      quality: [0, 0, 0],
      description: "Industrialization",
    }.freeze,
    'Anormal detector': {
      install: 100,
      cost: 5,
      production: [0, 0, 0],
      quality: [20, 20, 0],
      description: "It has better eyes than human's",
    }.freeze,
    'Fullauto machines': {
      install: 200,
      cost: 10,
      production: [25, 15, 10],
      quality: [10, 10, 10],
      description: "Let the machines do all the jobs",
    }.freeze,
  }.to_h {|k, v| [k, v.merge(name: k)] }.freeze

  def initialize(equipments, assignments)
    @equipments = equipments
    @assignments = assignments
    freeze
  end

  def production_volume
    if @equipments.find { _1[:name] == :'Factory base' }
      @assignments.sum { production_vol(_1, @equipments) }
    else
      0
    end
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

  def production_quality
    if @equipments.find { _1[:name] == :'Factory base' }
      x = @assignments.sum { production_quavol(_1, @equipments) } / production_volume.to_f
      x.nan? ? 0 : x
    else
      0
    end
  end

  private def production_quavol(d, equipments)
    case d.role
    when :mentor
      0
    when :produce
      if 0 < d.num
        d.num *
          (
            EmployeeGroup.lookup(d.employee_group_name).quality +
            equipments.map {|equipment| equipment[:quality][0] }.sum
          ) * (
            EmployeeGroup.lookup(d.employee_group_name).volume +
            equipments.map {|equipment| equipment[:production][0] }.sum
          )

      else
        0
      end
    else
      raise "Invalid role: #{d.role.inspect}"
    end
  end

  def self.lookup(equipment_name:)
    EQUIPMENTS[equipment_name.to_sym]
  end
end
