class CreateTranslations < ActiveRecord::Migration[6.0]
  class Translation < ApplicationRecord; end

  def change
    create_table :translations do |t|
      t.string :lang
      t.string :key
      t.string :value

      t.timestamps
    end


    reversible do |dir|
      dir.up do
        Translation.create!(lang: 'ja', key: "📰 Advertise", value: "📰 広告")
        Translation.create!(lang: 'ja', key: "<0>You need at least 5 credit</0><1>Cost&#58; $80K</1><2>You get +10 credit in the next month</2><3>You can only advertise once a month</3>", value: "<0>少なくともcreditが5必要です</0><1>Cost: $80K</1><2>翌月にcredit +10</2><3>広告は一月に一回まで</3>")
        Translation.create!(lang: 'ja', key: "Pay $80K to advertise", value: "広告を行う ($80Kの支払い)")
        Translation.create!(lang: 'ja', key: "Not enough cash", value: "Cash不足")
        Translation.create!(lang: 'ja', key: "🗄️ Storage", value: "🗄️ 倉庫")
        Translation.create!(lang: 'ja', key: "<0><0><0>$1K</0> to buy 100t capacity storage</0><1><0>$1K</0>/month to keep per 100t</1><2>Both products and ingredients are stored in storage. You can't store more than the capacity.</2><3><0>The overflow will be simply discarded, and pay penalty <1>$1K</1> per 5t.</0></3></0>", value: "<0><0>100t容量の倉庫ごとに<0>$1K</0></0><1>100tごとに月<0>$1K</0></1><2>商品と原料のどこらも倉庫に保持されます。容量より多くこれらを所持することはできません。</2><3><0>超過したものは、ペナルティ5tごとに<1>$1K</1>を支払って、破棄されます。</0></3></0>")
        Translation.create!(lang: 'ja', key: "Storage", value: "倉庫")
        Translation.create!(lang: 'ja', key: "You must buy Storage first", value: "まずは倉庫が必要です")
        Translation.create!(lang: 'ja', key: "Ingredient", value: "原料")
        Translation.create!(lang: 'ja', key: "Product Volume", value: "商品")
        Translation.create!(lang: 'ja', key: "Product Quality", value: "商品品質")
        Translation.create!(lang: 'ja', key: "Factory", value: "工場")
        Translation.create!(lang: 'ja', key: "Production Volume", value: "生産量")
        Translation.create!(lang: 'ja', key: "Production Quality", value: "生産品質")
        Translation.create!(lang: 'ja', key: "You must install Factory base first", value: "まずはFactory baseが必要です")
        Translation.create!(lang: 'ja', key: "If your cash goes less than 0, the game is over. if your total money goes equal or more than 1000, this game ends with your victory.", value: "現金が0未満になるとゲームオーバーです。所持金合計が1000以上になると勝利です。")
        Translation.create!(lang: 'ja', key: "Debt", value: "借金")
        Translation.create!(lang: 'ja', key: "Cash", value: "現金")
        Translation.create!(lang: 'ja', key: "Total", value: "合計")
        Translation.create!(lang: 'ja', key: "Contracts", value: "契約")
      end
    end
  end
end
