import BaseAPIController from "./BaseAPIController";
import db from "../models";

export class userBidController extends BaseAPIController {
  //   listMarkets = (req, res, next) => {
  //     db.marketMaker.find({}).then(markets => {
  //       res.json({ status: 1, data: markets });
  //     });
  //   };
  createuserBid = (req, res, next) => {
    db.userBid
      .findOne({ user_id: req.user._id, note_id: req.body.note_id })
      .then(userBid => {
          req.body.user_id = req.user._id;
        if (userBid) {
          db.userBid
            .update({ user_id: req.user._id, note_id: req.body.note_id }, req.body)
            .then(userBid => {
              res.json({ status: 1, data: userBid });
            });
        } else {
          db.userBid.create( req.body ).then(userBid => {
            res.json({ status: 1, data: userBid });
          });
        }
      });
  };
  //   updateuserBid = (req, res, next) => {
  // db.userBid.update({ _id: req.body._id }, req.body).then(userBid => {
  //   res.json({ status: 1, data: userBid });
  // });
  //   };
  //   deleteMarket = (req, res, next) => {
  //     db.marketMaker.remove({ _id: req.params.mongo_id }).then(data => {
  //       res.json({ status: 1, data: data });
  //     });
  //   };
}

const controller = new userBidController();
export default controller;
