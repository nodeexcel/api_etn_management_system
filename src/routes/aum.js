import Aum from "../controllers/aum";
import auth from "../middleware/auth";

export default app => {
  app.route("/aum/createAum").post(auth.requiresAdmin, Aum.createAum);

  return app;
};
