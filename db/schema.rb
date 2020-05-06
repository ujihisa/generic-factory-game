# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_06_025338) do

  create_table "factories", force: :cascade do |t|
    t.integer "game_id", null: false
    t.string "name", null: false
    t.integer "junior", default: 0, null: false
    t.integer "intermediate", default: 0, null: false
    t.integer "senior", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["game_id", "name"], name: "index_factories_on_game_id_and_name", unique: true
  end

  create_table "games", force: :cascade do |t|
    t.integer "player_id", null: false
    t.integer "month", default: 0, null: false
    t.integer "money", default: 100, null: false
    t.integer "storage", default: 0, null: false
    t.integer "ingredient", default: 0, null: false
    t.integer "product", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "players", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
