import BaseAPIController from "./BaseAPIController";
import db from "../models";

export class clientFeeController extends BaseAPIController {
  listClientFees = (req, res, next) => {
    db.clientFee.find({}).then(clientFees => {
      res.json({ status: 1, data: clientFees });
    });
  };
  createClientFee = (req, res, next) => {
    db.clientFee.create(req.body).then(clientFee => {
      res.json({ status: 1, data: clientFee });
    });
  };
  updateClientFee = (req, res, next) => {
    db.clientFee.update({ _id: req.body._id }, req.body).then(clientFee => {
      res.json({ status: 1, data: clientFee });
    });
  };
  deleteClientFee = (req, res, next) => {
    db.clientFee.remove({ _id: req.params.mongo_id }).then(data => {
      res.json({ status: 1, data: data });
    });
  };
}

const controller = new clientFeeController();
export default controller;
