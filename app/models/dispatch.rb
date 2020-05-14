# frozen_string_literal: true

class Dispatch < Struct.new(:role, :employee_group_name, :num)
  def self.employee_groups_with_num_hired(dispatches)
    dispatches.inject(EmployeeGroup::ALL) {|eg_all, dispatch|
      eg_all[dispatch.employee_group_name].num_hired = dispatch.num
      eg_all
    }
  end

  def self.production_vol(dispatches, equipments)
    dispatches.sum { _1.production_vol(equipments) }
  end

  def production_vol(equipments)
    case role
    when :mentor
      0
    when :produce
      EmployeeGroup.lookup(employee_group_name).volume +
        equipments.map {|equipment| equipment[:production][0] }.sum
    else
      raise "Invalid role: #{role.inspect}"
    end
  end
end
