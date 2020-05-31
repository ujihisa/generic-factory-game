# frozen_string_literal: true

class Darklaunch < ApplicationRecord
  belongs_to :player

  def self.v1_variation(key, player)
    where(key: key, player: player).exists?
  end
end
