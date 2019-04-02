import userBid from "../controllers/userBid";
import auth from "../middleware/auth";

export default app => {
  app.route("/userBid/createuserBid").post(auth.requiresAdmin, userBid.createuserBid);

//   app.route("/userBid/listuserBids").get(auth.requiresAdmin, userBid.listuserBids);

//   app.route("/userBid/updateuserBid").put(auth.requiresAdmin, userBid.updateuserBid);

//   app.route("/userBid/deleteuserBid/:mongoId").delete(auth.requiresAdmin, userBid.deleteuserBid);

  return app;
};
