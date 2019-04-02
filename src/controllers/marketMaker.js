import BaseAPIController from "./BaseAPIController";
import db from "../models";

export class marketMakerController extends BaseAPIController {
  listMarkets = (req, res, next) => {
    db.marketMaker.find({}).then(markets => {
      res.json({ status: 1, data: markets });
    });
  };
  createMarket = (req, res, next) => {
    db.marketMaker.create(req.body).then(market => {
      res.json({ status: 1, data: market });
    });
  };
  updateMarket = (req, res, next) => {
    db.marketMaker.update({ _id: req.body._id }, req.body).then(market => {
      res.json({ status: 1, data: market });
    });
  };
  deleteMarket = (req, res, next) => {
    db.marketMaker.remove({ _id: req.params.mongo_id }).then(data => {
      res.json({ status: 1, data: data });
    });
  };
}

const controller = new marketMakerController();
export default controller;
