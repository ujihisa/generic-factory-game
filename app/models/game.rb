class Game < ApplicationRecord
  belongs_to :player
  has_many :factories
  has_many :contracts

  def current_month
    [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ][month % 12]
  end

  def production
    factories.map {|factory|
      case factory.name
      when 'manual'
        factory.junior * 20 + factory.intermediate * 40 + factory.senior * 80
      when 'semi-auto'
        factory.junior * 50 + factory.intermediate * 60 + factory.senior * 80
      when 'full-auto'
        factory.junior * 80 + factory.intermediate * 80 + factory.senior * 80
      when 'idle'
        0
      else
        raise 'Must not happen'
      end
    }.sum / 2
  end
end
