import BaseAPIController from "./BaseAPIController";
import db from "../models";

export class AumController extends BaseAPIController {
  createAum = (req, res, next) => {
    db.aum.create(req.body).then(data => {
      res.json({ status: 1, data: data });
    });
  };
}

const controller = new AumController();
export default controller;
