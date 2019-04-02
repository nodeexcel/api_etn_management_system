import BaseAPIController from "./BaseAPIController";
import db from "../models";

export class ordersController extends BaseAPIController {
  createOrders = (req, res, next) => {
    req.body.userId = req.user._id;
    // db.note.findOne({isin:})
    let successFul = [];
    let unSuccessFul = [];
    insertOrders(req.body, successFul, unSuccessFul, function(resp) {
      res.json({ status: 1, data: resp });
    });
    // db.orders.insertMany(req.body).then(orders => {
    //   res.json({ status: 1, data: orders });
    // });
  };

  listOrders = (req, res, next) => {
    let query = {};
    if (req.query.isin) {
      query.isin = req.query.isin;
    }
    db.orders.find(query).then(orders => {
      orders.sort(
        function (a, b) {
          const x = new Date( a.trade_date);
          const y = new Date(b.trade_date);
          if (x<y) return 1;
          if (x>y) return -1;
          return 0;
        }
      );
      res.json({ status: 1, data: orders });
    });
  };

  updateOrder = (req, res, next) => {
    db.orders.update({ _id: req.body._id }, req.body).then(order => {
      res.json({ status: 1, data: order });
    });
  };

  deleteOrder = (req, res, next) => {
    db.orders.remove({ _id: req.params._id }).then(order => {
      res.json({ status: 1, data: order });
    });
  };
}


function insertOrders(body, successFul, unSuccessFul, callback) {
  if (body.length) {
    let order = body.splice(0, 1)[0];
    db.note.findOne({ isin: order.isin }).then(note => {
      let inventory =
        order.buy_or_sell == "B"
          ? note.number_of_units + order.certificate_number
          : note.number_of_units - order.certificate_number;
      if (
        order.buy_or_sell == "B" ||
        note.number_of_units > order.certificate_number
      ) {
        db.orders.create(order).then(data => {
          db.note
            .update({ _id: note._id }, { number_of_units: inventory })
            .then(updated => {});
          successFul.push(order);
          if (body.length) {
            insertOrders(body, successFul, unSuccessFul, callback);
          } else {
            callback({ success: successFul, unsuccessful: unSuccessFul });
          }
        });
      } else {
        unSuccessFul.push(order);
        if (body.length) {
          insertOrders(body, successFul, unSuccessFul, callback);
        } else {
          callback({ success: successFul, unsuccessful: unSuccessFul });
        }
      }
    });
  } else {
    callback({ success: successFul, unsuccessful: unSuccessFul });
  }
}
const controller = new ordersController();
export default controller;
