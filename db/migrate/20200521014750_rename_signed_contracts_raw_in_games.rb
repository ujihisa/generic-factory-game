class RenameSignedContractsRawInGames < ActiveRecord::Migration[6.0]
  def change
    change_table :games do |t|
      t.rename :signed_contracts_raw, :signed_contracts
      t.change_default :signed_contracts, '{}'
    end
  end
end
