# frozen_string_literal: true

class Factory
  EQUIPMENTS = {
    'Factory base': {
      install: 10,
      cost: 20,
      production: { Junior: 0, Intermediate: 0, Senior: 0 },
      quality: { Junior: 0, Intermediate: 0, Senior: 0 },
      description: "It doesn't help you producing but without it you can't produce anything. The rent is not cheap too.",
    }.freeze,
    Conveyor: {
      install: 100,
      cost: 5,
      production: { Junior: 10, Intermediate: 10, Senior: 10 },
      quality: { Junior: 0, Intermediate: 0, Senior: 0 },
      description: "Now staff don't have to walk around, but stuff walk around instead.",
    }.freeze,
    'Advanced toolsets': {
      install: 100,
      cost: 0,
      production: { Junior: 0, Intermediate: 5, Senior: 10 },
      quality: { Junior: 0, Intermediate: 5, Senior: 10 },
      description: "Leverage skilled craftspersons. Advanced people need advanced tools.",
    }.freeze,
    'Free space': {
      install: 100,
      cost: 0,
      production: { Junior: -5, Intermediate: -5, Senior: -5 },
      quality: { Junior: 20, Intermediate: 20, Senior: 20 },
      description: "Enjoy your relaxed time",
    }.freeze,
    'Computers': {
      install: 200,
      cost: 5,
      production: { Junior: 0, Intermediate: 0, Senior: 0 },
      quality: { Junior: 10, Intermediate: 10, Senior: 10 },
      description: "Helps you archtechting, designing, sharing knowledge, and many more",
    }.freeze,
    'Semiauto machines': {
      install: 200,
      cost: 10,
      production: { Junior: 10, Intermediate: 10, Senior: 10 },
      quality: { Junior: 0, Intermediate: 0, Senior: 0 },
      description: "Industrialization",
    }.freeze,
    'Anormal detector': {
      install: 300,
      cost: 5,
      production: { Junior: 0, Intermediate: 0, Senior: 0 },
      quality: { Junior: 20, Intermediate: 20, Senior: 0 },
      description: "It has better eyes than human's",
    }.freeze,
    'Fullauto machines': {
      install: 400,
      cost: 10,
      production: { Junior: 25, Intermediate: 15, Senior: 10 },
      quality: { Junior: 10, Intermediate: 10, Senior: 10 },
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

  private def production_vol(a, equipments)
    case a.role
    when :mentor
      0
    when :produce
      if 0 < a.num
        a.num * (
          EmployeeGroup.lookup(a.employee_group_name).volume +
          equipments.map {|equipment| equipment[:production][a.employee_group_name] }.sum)
      else
        0
      end
    else
      raise "Invalid role: #{d.role.inspect}"
    end
  end

  def production_quality
    if @equipments.find { _1[:name] == :'Factory base' }
      x = self.class.__production_quavol(@assignments, @equipments) / production_volume.to_f
      x.nan? ? 0 : x
    else
      0
    end
  end

  def self.__production_quavol(assignments, equipments)
    assignments_by_role = assignments.group_by(&:role)

    mentor_qualities = (assignments_by_role[:mentor] || []).flat_map {|mentor|
      quality_per_person =
        EmployeeGroup.lookup(mentor.employee_group_name).quality +
        equipments.sum {|equipment| equipment[:quality][mentor.employee_group_name] }
      [quality_per_person] * mentor.num * 3
    }.sort.reverse

    producer_tuples = (assignments_by_role[:produce] || []).flat_map {|producer|
      next nil if producer.num <= 0

      eg = EmployeeGroup.lookup(producer.employee_group_name)
      [
        [
          eg.volume + equipments.sum {|eqt| eqt[:production][producer.employee_group_name] },
          eg.quality + equipments.sum {|eqt| eqt[:quality][producer.employee_group_name] },
        ]
      ] * producer.num
    }.compact.sort_by(&:last)

    producer_tuples.map.with_index {|(producer_vol, producer_qua), i|
      producer_vol * [producer_qua, mentor_qualities[i].to_i].max
    }.sum
  end

  def self.lookup(equipment_name:)
    EQUIPMENTS[equipment_name.to_sym]
  end
end
