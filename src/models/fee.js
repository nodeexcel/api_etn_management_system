import mongoose from "mongoose";
import connection from "../db.js";
let Schema = mongoose.Schema;

//Fee Collection for Cirdan
let FeeSchema = new Schema(
  {
    isin: String,
    ib_account: String,
    date: Date,
    brokerage_fee: Number,
    management_fee: Number,
    market_making_fee: Number
  },
  {
    timestamps: true
  }
);

module.exports = connection.conn.model("FEE", FeeSchema);
