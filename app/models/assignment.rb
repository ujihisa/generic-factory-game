# frozen_string_literal: true

class Assignment < Struct.new(:role, :employee_group_name, :num)
  def self.employee_groups_with_num_hired(assignments)
    assignments.inject(EmployeeGroup::ALL) {|eg_all, assignment|
      key = assignment.employee_group_name
      eg = EmployeeGroup.new(**eg_all[key].to_h)
      eg.num_hired ||= 0
      eg.num_hired += assignment.num

      eg_all.merge(key => eg)
    }
  end

  def employee_group
    EmployeeGroup.lookup(employee_group_name)
  end
end
