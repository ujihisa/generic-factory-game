# frozen_string_literal: true

class SignedContracts
  include ActiveModel::Validations
  validate :validate_name

  def initialize(hash)
    @hash = hash.to_h
  end

  def self.load(json)
    return nil unless json
    new(JSON.parse(json))
  end

  def as_json(_options = {})
    @hash.as_json(_options)
  end

  def self.dump(signed_contracts)
    signed_contracts.to_json
  end

  # delegate :each, to: :@hash
  def each(&b)
    @hash.transform_keys { Contract.find(name: _1) }.each(&b)
  end
  include Enumerable

  def sign(month, contract_name)
    @hash[contract_name] = month
  end

  def diff(another)
    to_a - another.to_a
  end

  def product_required(display_month)
    @hash.sum {|contract, _|
      Contract.find(name: contract).trade(display_month).required_products
    }
  end

  def cancel(month)
    @hash = @hash.select {|_, v| v != month }
  end

  private def validate_name
    @hash.each do |contract_name, month|
      unless Contract.find(name: contract_name)
        self.errors.add(:signed_contracts, "Contract name #{contract_name.inspect} is not valid")
      end
    end
  end
end
