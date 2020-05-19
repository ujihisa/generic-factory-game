# frozen_string_literal: true

class EmployeeGroup < Struct.new(:name, :category, :image, :recruiting_fee, :salary, :volume, :quality, :required_credit, :num_hired, keyword_init: true)
  ALL = {
    Junior: new(
      category: :Junior,
      image: "employee-junior.png",
      recruiting_fee: 3,
      salary: 3,
      volume: 10,
      quality: 20,
      required_credit: 0,
    ),
    Intermediate: new(
      category: :Intermediate,
      image: "employee-intermediate.png",
      recruiting_fee: 5,
      salary: 5,
      volume: 20,
      quality: 20,
      required_credit: 0,
    ),
    Senior: new(
      category: :Senior,
      image: "employee-senior.png",
      recruiting_fee: 7,
      salary: 7,
      volume: 20,
      quality: 40,
      required_credit: 1,
    ),
    'Motivated intermediate': new(
      category: :Intermediate,
      image: "employee-intermediate.png",
      recruiting_fee: 4,
      salary: 3,
      volume: 20,
      quality: 20,
      required_credit: 65,
    ),
    'Passionated junior': new(
      category: :Junior,
      image: "employee-junior.png",
      recruiting_fee: 2,
      salary: 1,
      volume: 10,
      quality: 20,
      required_credit: 85,
    ),
  }.each {|k, v| v.name = k; v.freeze }.freeze

  def self.lookup(name)
    ALL[name]
  end

  def salary_total
    salary * num_hired
  end
end
