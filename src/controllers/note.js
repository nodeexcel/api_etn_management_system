import BaseAPIController from "./BaseAPIController";
import db from "../models";

export class noteController extends BaseAPIController {
  createNote = (req, res, next) => {
    // var isin = "";
    // var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    // for (var i = 0; i < 7; i++) {
    //   isin += possible.charAt(Math.floor(Math.random() * possible.length));
    // }
    db.note.create(req.body).then(note => {
      res.json({ status: 1, data: note });
    });
  };

  listNotes = (req, res, next) => {
    let notesWithStatus = [];
    db.note.find({ confirm_status: req.query.confirm_status }).then(notes => {
      notes = JSON.parse(JSON.stringify(notes));
      getStatus(notes, notesWithStatus => {
        res.json({ status: 1, data: notesWithStatus });
      });
    });

    function getStatus(notes, callback) {
      if (notes.length) {
        let oneNote = notes.splice(0, 1)[0];
        let commission = 0;

        db.fee.find({ isin: oneNote.isin }).then(fees => {
          fees.forEach(fee => {
            commission +=
              parseFloat(fee.brokerage_fee) +
              parseFloat(fee.management_fee) +
              parseFloat(fee.market_making_fee);
          });
          oneNote.commission = commission;
          db.userBid
            .findOne({ user_id: req.user._id, note_id: oneNote._id })
            .then(userBid => {
              db.aum.findOne({ note_id: oneNote._id }).then(aum => {
                oneNote.aum = aum ? aum.aum : null;
                if (userBid) {
                  oneNote.manual_ask_price = userBid.manual_ask_price;
                  oneNote.manual_ask_size = userBid.manual_ask_size;
                  oneNote.manual_bid_price = userBid.manual_bid_price;
                  oneNote.manual_bid_size = userBid.manual_bid_size;
                }
                db.orders.find({ isin: oneNote.isin }).then(order => {
                  if (order.length) {
                    const lastOrder = order[order.length - 1];
                    oneNote.currentBidPrice = lastOrder.currentBidPrice;
                    oneNote.currentAskPrice = lastOrder.currentAskPrice;
                    oneNote.currentBidSize = lastOrder.currentBidSize;
                    oneNote.currentAskSize = lastOrder.currentAskSize;
                    oneNote.status = true;
                  } else {
                    oneNote.status = false;
                  }
                  notesWithStatus.push(oneNote);
                  if (notes.length) {
                    getStatus(notes, callback);
                  } else {
                    callback(notesWithStatus);
                  }
                });
              });
            });
        });
      } else {
        callback(notesWithStatus);
      }
    }
    function getCommission(fees, note, callback) {}
  };

  updateNote = (req, res, next) => {
    db.note.update({ _id: req.body._id }, req.body).then(note => {
      res.json({ status: 1, data: note });
    });
  };

  deleteNote = (req, res, next) => {
    db.note.remove({ _id: req.params._id }).then(note => {
      res.json({ status: 1, data: note });
    });
  };
}

const controller = new noteController();
export default controller;
