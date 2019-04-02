import mongoose from "mongoose";
import connection from "../db.js";
import "./note";
let Schema = mongoose.Schema;

let CertificateSchema = new Schema(
  {
    isin: String,
    ib_account: String,
    client: String,
    currency: String,
    maturity: Date,
    inventory: Number,
    outstanding: Number,
    AUM: Number,
    commissions: Number,
    status: Boolean,
    ask_price: Number,
    bid_price: Number,
    bid_size: Number,
    ask_size: Number,
    daily_change_percent: Number
  },
  {
    timestamps: true
  }
);

module.exports = connection.conn.model("CERTIFICATE", CertificateSchema);
