# frozen_string_literal: true

class EmployeeGroup < Struct.new(:name, :category, :image, :recruiting_fee, :salary, :volume, :quality, :required_credit, :num_hired, keyword_init: true)
  ALL = {
    Junior: new(
      category: :junior,
      image: "employee-junior.png",
      recruiting_fee: 3,
      salary: 3,
      volume: 10,
      quality: 20,
      required_credit: 0,
    ).freeze,
    Intermediate: new(
      category: :intermediate,
      image: "employee-intermediate.png",
      recruiting_fee: 5,
      salary: 5,
      volume: 20,
      quality: 20,
      required_credit: 0,
    ).freeze,
    Senior: new(
      category: :senior,
      image: "employee-senior.png",
      recruiting_fee: 7,
      salary: 3,
      volume: 20,
      quality: 40,
      required_credit: 1,
    ).freeze,
    Chief: new(
      category: :senior,
      image: "employee-senior.png",
      recruiting_fee: 10,
      salary: 7,
      volume: 10,
      quality: 60,
      required_credit: 40,
    ).freeze,
    'Motivated intermediate': new(
      category: :intermediate,
      image: "employee-intermediate.png",
      recruiting_fee: 4,
      salary: 4,
      volume: 20,
      quality: 20,
      required_credit: 70,
    ).freeze,
    'Passionated junior': new(
      category: :junior,
      image: "employee-junior.png",
      recruiting_fee: 2,
      salary: 2,
      volume: 10,
      quality: 20,
      required_credit: 90,
    ).freeze,
  }.freeze

  def self.lookup(name)
    ALL[name]
  end
end
