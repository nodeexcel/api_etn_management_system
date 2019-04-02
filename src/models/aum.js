import mongoose from "mongoose";
import connection from "../db.js";
let Schema = mongoose.Schema;

let AumSchema = new Schema(
  {
    note_id: String,
    aum: Number
  },
  {
    timestamps: true
  }
);

module.exports = connection.conn.model("AUM", AumSchema);
