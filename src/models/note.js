import mongoose from "mongoose";
import connection from "../db.js";
let Schema = mongoose.Schema;

let NoteSchema = new Schema(
  {
    isin: String,
    client_full_name: String,
    client_email: String,
    client_phone_number: String,
    sales: String,
    currency: String,
    issue_date: Date,
    maturity_date: Date,
    denomination: Number,
    number_of_units: Number,
    standard_spread: Number,
    brokerage_fees: Number,
    sales_management_fees: Number,
    client_management_fees: Number,
    one_off_fee: Number,
    issuance_cost: Number,
    running_cost: Number,
    ib_account: String,
    confirm_status: {
      type:Boolean,
      default: false
    },
    order: [{
      type: Schema.Types.ObjectId,
      ref: "order"
    }],
    outstanding: Number,
    AUM: Number,
    commissions: Number,
    status: Boolean,
    ask_price: Number,
    bid_price: Number,
    bid_size: Number,
    ask_size: Number,
    daily_change_percent: Number,

    indexTicker: String,
    noteTicker: String
  },
  {
    timestamps: true
  }
);

module.exports = connection.conn.model("NOTE", NoteSchema);
