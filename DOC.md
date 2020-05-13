## Creditの稼ぎ方

* 0~19
    * 契約で毎月+n
    * 雇用で毎月+n
    * $10K以上借金していると+1
    * 例: 契約2つ、雇用2つで毎月+4
* 20~39
    * 契約で毎月+n
    * $30K以上借金していると+1
    * 例: 契約4つ、雇用5つで毎月+4
* 40~59
    * 契約で毎月+1
    * $50K以上借金していると+1
    * 例: 契約8つ、雇用10つで毎月+1
* 60~79
    * $70K以上借金していると+1
* 80~99
    * No

* Product Quality
    * -3 ~ +3
    * たとえば+3をキープすれば17ヶ月で50
* Advertise
    * $40 -> $80 -> $120
    * 翌月に+3

失い方
* 契約を守れない
* (未実装) 解雇
* (未実装) 原料の破棄?

---

employees

* junior 10t, 20q
* intermediate 20t, 20q
* senior 20t, 40q
* chief 10t, 60q

role
* produce
* mentor
    * 1人につき3人まで、自分と同じqualityまで高める

customize (工場全体に永続有効、重複有り)

* workbenches
    * 
* machines
    * 生産+10
* advanced toolsets
    * junior生産+5, intermediate生産+10, senior生産+40
* free space
    * 生産-5, quality +20
* computers
    * quality +10

---

product quality

sum{quality * vol / sum_vol}
例: jjis: 20 * 10/60 + 20 * 10/60 + 20 * 20/60 + 40 * 20/60
    = (1600/60) = 26.67

* 高くする方法
    * seniorが作る
    * seniorがquality assuranceする
    * high-quality full-autoを所有
* creditを高める
    * 基本的に、creditは現在のqualityに収束する
    * credit + 20 <= quality
        * +3
    * credit + 10 <= quality
        * +1
    * -9 〜 +9
        * 0
    * credit - 10 <= quality
        * -1
    * credit - 20 <= quality
        * -3

---
harajune

■共通して言えること
流動資産（特に現金）の状況
■注文するとき
十分なデリバリー能力があるか（生産能力が月産5000の工場に100万個は注文しない）
品質
管理能力
■銀行
営業利益率（金利は、利益から払うので）
流動比率とか負債比率とか（金返せそうか）
■入社
給料
労働条件（深夜残業が多いかとか、休みあるかとか）
---

#!bin/rails runner

puts "Production\t\t\t\tQuality"
equipments = []
Factory::EQUIPMENTS.each do |name, equipment|
  equipments << equipment
  pbonuses = Array.new(3) {|i| equipments.sum {_1[:production][i]} }
  qbonuses = Array.new(3) {|i| equipments.sum {_1[:quality][i]} }
  puts "  #{name}:\t#{1 + pbonuses[0]}\t#{2 + pbonuses[1]}\t#{2 + pbonuses[2]}\t#{2 + qbonuses[0]}\t#{2 + qbonuses[1]}\t#{4 + qbonuses[2]}"
end
