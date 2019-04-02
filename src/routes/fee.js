import fee from "../controllers/fee";
import auth from "../middleware/auth";

export default app => {
  app.route("/fee/createFee").post(auth.requiresAdmin, fee.createFee);

  app.route("/fee/listFees").get(auth.requiresAdmin, fee.listFees);

  app.route("/fee/updateFee").put(auth.requiresAdmin, fee.updateFee);

  app
    .route("/fee/deleteFee/:mongoId")
    .delete(auth.requiresAdmin, fee.deleteFee);

  app.route("/fee/getEndOfMonthSplit").get(fee.getEndOfMonthSplit);

  app.route("/fee/getEndOfMonthSplitExact").post(auth.requiresAdmin, fee.getEndOfMonthSplitExact);

  return app;
};
