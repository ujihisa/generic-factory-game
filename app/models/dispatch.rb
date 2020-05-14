# frozen_string_literal: true

class Dispatch < Struct.new(:role, :employee_group_name, :num)
  def self.employee_groups_with_num_hired(dispatches)
    dispatches.inject(EmployeeGroup::ALL) {|eg_all, dispatch|
      key = dispatch.employee_group_name
      eg = EmployeeGroup.new(**eg_all[key].to_h)
      eg.num_hired = dispatch.num

      eg_all.merge(key => eg)
    }
  end
end
