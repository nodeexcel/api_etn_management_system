import mongoose from "mongoose";
import connection from "../db.js";
import "./note";
let Schema = mongoose.Schema;

let OrderSchema = new Schema(
  {
    isin: String,
    ib_account: String,
    certificate_number: Number,
    price: Number,
    total_amount: Number,
    trade_date: Date,
    value_date: Date,
    'sales_P&L': Number,
    market_maker_fee: Number,
    buy_or_sell: String,
    exchange: String,
    status: {
      type: Boolean,
      default: false
    },
    settlement_status: { type: String, enum: ['Pending', 'Settled'], default: "Pending" }

    //   currentBidPrice:String,
    //   currentAskPrice:String,
    //   currentSpread:String,
    //   currentBidSize:String,
    //   currentAskSize:String,
    //   exchange: String,
    //   fee_brokerage: Number,
    //   fee_market_maker: Number,
    //   fee_management: Number,
    //   status: Boolean,
    //   userId: {
    //     type : Schema.Types.ObjectId,
    //     ref: 'user',
    //     required : true
    //   },
    //   note: {
    //     type : Schema.Types.ObjectId,
    //     ref: 'NOTE',
    //     required : true
    //   }
  },
  {
    timestamps: true
  }
);

module.exports = connection.conn.model("ORDER", OrderSchema);
