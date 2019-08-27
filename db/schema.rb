# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180611194756) do

  create_table "busqueda", id: false, force: :cascade do |t|
    t.string  "probe",             limit: 10
    t.decimal "rank_metric_score",            precision: 20, scale: 18
    t.string  "filename",          limit: 45
  end

  create_table "nutrigenomic", id: false, force: :cascade do |t|
    t.string  "symbol",          limit: 40
    t.decimal "log2fc",                      precision: 20, scale: 18
    t.decimal "aveexp",                      precision: 20, scale: 18
    t.decimal "pvalue",                      precision: 20, scale: 18
    t.decimal "adjusted_pvalue",             precision: 20, scale: 18
    t.string  "filename",        limit: 100
  end

  create_table "patients", force: :cascade do |t|
    t.integer  "age",        limit: 4
    t.string   "gender",     limit: 255
    t.integer  "weight",     limit: 4
    t.string   "city",       limit: 255
    t.string   "number_of",  limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "reviewers", force: :cascade do |t|
    t.string   "names",      limit: 255
    t.string   "last_name",  limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

end
