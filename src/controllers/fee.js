import BaseAPIController from "./BaseAPIController";
import db from "../models";
import fee from "../routes/fee";

export class FeeController extends BaseAPIController {
  listFees = (req, res, next) => {
    if (JSON.parse(req.query.calculated)) {
      let date = new Date();
      let oneMonthAgo = new Date(date.getFullYear(), date.getMonth(), 1);
      let oneYearAgo = new Date(date.getFullYear(), 1, 1);
      let query = {};
      if (req.query.isin) {
        query.isin = req.query.isin;
      }
      db.fee.find(query).then(fees => {
        db.orders.find(query).then(
            orders =>{
              const bf = findFee(fees, oneMonthAgo, oneYearAgo);
              const mf = marketFee(orders, oneMonthAgo,oneYearAgo);
              bf.MTD.market_making_fee = mf.MTD.market_making_fee;
              bf.YTD.market_making_fee = mf.YTD.market_making_fee;
              bf.inception.market_making_fee = mf.inception.market_making_fee;
              res.json({ status: 1, data: bf });
            }
      );
      }
      )
    } else {
      db.fee.find({}).then(fees => {
        res.json({ status: 1, data: fees });
      });
    }
  };
  createFee = (req, res, next) => {
    db.fee.create(req.body).then(fee => {
      res.json({ status: 1, data: fee });
    });
  };
  updateFee = (req, res, next) => {
    db.fee.update({ _id: req.body._id }, req.body).then(fee => {
      res.json({ status: 1, data: fee });
    });
  };
  deleteFee = (req, res, next) => {
    db.fee.remove({ _id: req.params.mongo_id }).then(data => {
      res.json({ status: 1, data: data });
    });
  };

  getEndOfMonthSplit = (req, res, next) => {
    db.note.find({}).then(notes => {
      let feedata = [];
      endOfMonthData(notes, feedata, function(response) {
        res.json({ status: 1, data: response });
      });
    });
  };

  getEndOfMonthSplitExact = (req, res, next) => {
      endofMonthDataExact(req.body, function(response) {
        res.json({ status: 1, data: response });
      });
  };
}

function endofMonthDataExact(reqdata, callback){
  const startDate =  new Date(reqdata.start_date);
  const endDate = new Date(reqdata.end_date);
  const curDate = new Date();
  if(reqdata.isin.length === 12 && reqdata.start_date && reqdata.end_date &&
      startDate < endDate && startDate < curDate
  ){

    db.fee
        .aggregate([
          {
            $match: {
              isin: reqdata.isin,
              createdAt: { $gte: startDate,
                            $lt: endDate
              }
            }
          },
          {
            $group: {
              _id: "$isin",
              management_fee: {
                $sum: "$management_fee"
              },
              brokerage_fee_cirdan: {
                $sum: "$brokerage_fee"
              }
            }
          }
        ])
        .then(cirdanFees => {
          db.clientFee
              .aggregate([
                {
                  $match: {
                    isin: reqdata.isin,
                    createdAt: {  $gte: startDate,
                      $lt: endDate   }
                  }
                },
                {
                  $group: {
                    _id: "$isin",
                    management_fee: {
                      $sum: "$management_fee"
                    },
                    brokerage_fee_client: {
                      $sum: "$brokerage_fee"
                    }
                  }
                }
              ])
              .then(clientFees => {
                let finalData = cirdanFees[0]
                    ? JSON.parse(JSON.stringify(cirdanFees))
                    : JSON.parse(JSON.stringify(clientFees));
                if (finalData[0] || clientFees[0]) {
                  finalData[0].ib_account = reqdata.ib_account;
                  let totalManageFee = 0;
                  totalManageFee += clientFees[0]
                      ? clientFees[0].management_fee
                      : 0;
                  totalManageFee += cirdanFees[0]
                      ? cirdanFees[0].management_fee
                      : 0;
                  finalData[0].management_fee = totalManageFee;
                  finalData[0].brokerage_fee_client = clientFees[0]
                      ? clientFees[0].brokerage_fee_client
                      : 0;
                  const reponse = {
                    isin: finalData[0]._id,
                    ib_account: reqdata.ib_account,
                    start_date: reqdata.start_date,
                    end_date: reqdata.end_date,
                    total_amount_to_withdraw: finalData[0].management_fee +
                        finalData[0].brokerage_fee_cirdan + finalData[0].brokerage_fee_client,
                    management_fee: finalData[0].management_fee,
                    brokerage_fee_client: finalData[0].brokerage_fee_client,
                    brokerage_fee_cirdan: finalData[0].brokerage_fee_cirdan
                  };
                  callback(reponse)
                }else{
                  const reponse = {
                    isin: reqdata.isin,
                    ib_account: reqdata.ib_account,
                    start_date: reqdata.start_date,
                    end_date: reqdata.end_date,
                    total_amount_to_withdraw:0,
                    management_fee:0,
                    brokerage_fee_client: 0,
                    brokerage_fee_cirdan: 0
                  };
                  callback(reponse)
                }
              });
        });
  } else {
    const reponse = {
      isin: reqdata.isin,
      ib_account: reqdata.ib_account,
      start_date: reqdata.start_date,
      end_date: reqdata.end_date,
      total_amount_to_withdraw:0,
      management_fee:0,
      brokerage_fee_client: 0,
      brokerage_fee_cirdan: 0
    };
    callback(reponse);
  }
}

function endOfMonthData(notes, feedata, callback) {
  if (notes.length) {
    let oneNote = notes.splice(0, 1)[0];
    let date = new Date();
    let firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    db.fee
      .aggregate([
        {
          $match: {
            isin: oneNote.isin,
            createdAt: { $gte: firstOfMonth}
          }
        },
        {
          $group: {
            _id: "$isin",
            management_fee: {
              $sum: "$management_fee"
            },
            brokerage_fee_cirdan: {
              $sum: "$brokerage_fee"
            }
          }
        }
      ])
      .then(cirdanFees => {
        db.clientFee
          .aggregate([
            {
              $match: {
                isin: oneNote.isin,
                createdAt: { $gte: firstOfMonth }
              }
            },
            {
              $group: {
                _id: "$isin",
                management_fee: {
                  $sum: "$management_fee"
                },
                brokerage_fee_client: {
                  $sum: "$brokerage_fee"
                }
              }
            }
          ])
          .then(clientFees => {
            let finalData = cirdanFees[0]
              ? JSON.parse(JSON.stringify(cirdanFees))
              : JSON.parse(JSON.stringify(clientFees));
            if (finalData[0] || clientFees[0]) {
              finalData[0].ib_account = oneNote.ib_account;
              let totalManageFee = 0;
              totalManageFee += clientFees[0]
                ? clientFees[0].management_fee
                : 0;
              totalManageFee += cirdanFees[0]
                ? cirdanFees[0].management_fee
                : 0;
              finalData[0].management_fee = totalManageFee;
              finalData[0].brokerage_fee_client = clientFees[0]
                ? clientFees[0].brokerage_fee_client
                : 0;
              feedata.push(finalData[0]);

            }
            if (notes.length) {
              endOfMonthData(notes, feedata, callback);
            } else {
              callback(feedata);
            }
          });
      });
  } else {
    callback(feeData);
  }
}

function findFee(fees, oneMonthAgo,oneYearAgo) {

  let feeData = {
    MTD: { brokerage_fee: 0, management_fee: 0},
    YTD: { brokerage_fee: 0, management_fee: 0},
    inception: { brokerage_fee: 0, management_fee: 0 }
  };
  for (var i = 0; i< fees.length ; i++)
  {
    let oneFee = fees[i];
    if (oneFee.createdAt >= oneMonthAgo) {
      feeData.MTD.brokerage_fee += oneFee.brokerage_fee
          ? oneFee.brokerage_fee
          : 0;
      feeData.MTD.management_fee += oneFee.management_fee
          ? oneFee.management_fee
          : 0;
    }

    if (oneFee.createdAt >= oneYearAgo) {
      feeData.YTD.brokerage_fee += oneFee.brokerage_fee
          ? oneFee.brokerage_fee
          : 0;
      feeData.YTD.management_fee += oneFee.management_fee
          ? oneFee.management_fee
          : 0;
    }
    feeData.inception.brokerage_fee += oneFee.brokerage_fee
        ? oneFee.brokerage_fee
        : 0;
    feeData.inception.management_fee += oneFee.management_fee
        ? oneFee.management_fee
        : 0;

  }
  console.log(feeData);
    return feeData;
}

function marketFee(orders, oneMonthAgo,oneYearAgo) {

  let feeData = {
    MTD: { brokerage_fee: 0, management_fee: 0, market_making_fee: 0 },
    YTD: { brokerage_fee: 0, management_fee: 0, market_making_fee: 0 },
    inception: { brokerage_fee: 0, management_fee: 0, market_making_fee: 0 }
  };
  for (var i = 0; i< orders.length ; i++){
    let oneOrder = orders[i];
    if (oneOrder.trade_date >= oneMonthAgo) {
      feeData.MTD.market_making_fee += oneOrder['sales_P&L']
          ? oneOrder['sales_P&L']
          : 0;
    }
    if (oneOrder.trade_date >= oneYearAgo) {
      feeData.YTD.market_making_fee += oneOrder['sales_P&L']
          ?  oneOrder['sales_P&L']
          : 0;
    }

    feeData.inception.market_making_fee +=  oneOrder['sales_P&L']
        ?  oneOrder['sales_P&L']
        : 0;
  }

  return feeData;

}

const controller = new FeeController();
export default controller;
