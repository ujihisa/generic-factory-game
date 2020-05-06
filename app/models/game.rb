class Game < ApplicationRecord
  belongs_to :player
  has_many :factories
  has_many :contracts

  def status
    case money
    when (...0)
      :game_over
    when 0..1000
      :in_progress
    when (1001..)
      :completed
    else
      raise 'Must not happen'
    end
  end

  def current_month
    [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ][month % 12]
  end

  def next_month
    [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ][month + 1 % 12]
  end

  def production
    factories.map(&:production).sum / 2
  end
end
