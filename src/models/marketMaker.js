import mongoose from "mongoose";
import connection from "../db.js";
let Schema = mongoose.Schema;

let MarketMakerSchema = new Schema(
  {
    exchange: String,
    name: String,
    email: String,
    phone_no: Number,
    contact_name: String,
    fees: Number
  },
  {
    timestamps: true
  }
);

module.exports = connection.conn.model("MARKET", MarketMakerSchema);
