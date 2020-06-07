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

ActiveRecord::Schema.define(version: 2020_06_07_173920) do

  create_table "admins", force: :cascade do |t|
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_admins_on_user_id", unique: true
  end

  create_table "contracts", force: :cascade do |t|
    t.integer "game_id", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["game_id", "name"], name: "index_contracts_on_game_id_and_name", unique: true
  end

  create_table "darklaunches", force: :cascade do |t|
    t.string "key", null: false
    t.integer "player_id", null: false
    t.datetime "created_at", precision: 6, default: "2020-06-04 21:25:55", null: false
    t.datetime "updated_at", precision: 6, default: "2020-06-04 21:25:55", null: false
    t.index ["key"], name: "index_darklaunches_on_key"
    t.index ["player_id"], name: "index_darklaunches_on_player_id", unique: true
  end

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
    t.integer "cash", default: 100, null: false
    t.integer "storage", default: 0, null: false
    t.integer "ingredient", default: 0, null: false
    t.integer "product", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "version_major", null: false
    t.integer "credit", default: 0, null: false
    t.integer "money", default: 0, null: false
    t.integer "ingredient_subscription", default: 0, null: false
    t.text "messages_raw", default: "[]", null: false
    t.text "portfolios_raw", default: "[]", null: false
    t.text "signed_contracts", default: "{}", null: false
    t.text "equipment_names_raw", default: "[]", null: false
    t.text "assignments_raw", default: "[]", null: false
    t.float "quality", default: 0.0, null: false
    t.string "mode", default: "normal", null: false
    t.boolean "advertising", default: false, null: false
    t.text "employee_groups_raw", default: "{}", null: false
    t.text "alerts_raw", default: "[]", null: false
    t.string "version_patch"
    t.index ["mode"], name: "index_games_on_mode"
    t.index ["player_id", "cash", "month"], name: "index_games_on_player_id_and_cash_and_month"
    t.index ["updated_at"], name: "index_games_on_updated_at"
    t.index ["version_major"], name: "index_games_on_version_major"
  end

  create_table "players", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "translations", force: :cascade do |t|
    t.string "lang"
    t.string "key"
    t.string "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "player_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["player_id"], name: "index_users_on_player_id", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
