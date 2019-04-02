import clientFee from "../controllers/clientFee";
import auth from "../middleware/auth";

export default app => {
  app.route("/clientFee/createClientFee").post(auth.requiresAdmin, clientFee.createClientFee);

  app.route("/clientFee/listClientFees").get(auth.requiresAdmin, clientFee.listClientFees);

  app.route("/clientFee/updateClientFee").put(auth.requiresAdmin, clientFee.updateClientFee);

  app
    .route("/clientFee/deleteclientFee/:mongoId")
    .delete(auth.requiresAdmin, clientFee.deleteClientFee);

  return app;
};
