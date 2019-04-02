import mongoose from "mongoose";
import connection from "../db.js";
let Schema = mongoose.Schema;

//Fee Collection for Client
let ClientFeeSchema = new Schema(
  {
    isin: String,
    date: Date,
    brokerage_fee: Number,
    management_fee: Number
  },
  {
    timestamps: true
  }
);

module.exports = connection.conn.model("CLIENTFEE", ClientFeeSchema);
