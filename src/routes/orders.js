import orders from "../controllers/orders";
import auth from "../middleware/auth";

export default app => {
  app.route("/orders/createOrder").post(auth.requiresAdmin, orders.createOrders);

  app.route("/orders/listOrders").get(auth.requiresAdmin, orders.listOrders);

  app.route("/orders/updateOrder").put(auth.requiresAdmin, orders.updateOrder);

  app.route("/orders/deleteOrder/:mongoId").delete(auth.requiresAdmin, orders.deleteOrder);

  return app;
};
