import marketMaker from "../controllers/marketMaker";
import auth from "../middleware/auth";

export default app => {
  app
    .route("/market/createMarket")
    .post(auth.requiresAdmin, marketMaker.createMarket);

  app
    .route("/market/listMarkets")
    .get(auth.requiresAdmin, marketMaker.listMarkets);

  app
    .route("/market/updateMarket")
    .put(auth.requiresAdmin, marketMaker.updateMarket);

  app
    .route("/market/deleteMarket/:mongo_id")
    .delete(auth.requiresAdmin, marketMaker.deleteMarket);

  return app;
};
