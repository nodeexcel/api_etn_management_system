import mongoose from "mongoose";
import connection from "../db.js";
let Schema = mongoose.Schema;

let userBidSchema = new Schema(
    {
        user_id: String,
        note_id: String,
        manual_ask_price: Number,
        manual_bid_price: Number,
        manual_ask_size: Number,
        manual_bid_size: Number
    },
    {
        timestamps: true
    }
);

module.exports = connection.conn.model("USERBID", userBidSchema);