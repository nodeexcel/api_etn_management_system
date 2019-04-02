import note from "../controllers/note";
import auth from "../middleware/auth";

export default app => {
  app.route("/note/createNote").post(auth.requiresAdmin, note.createNote);

  app.route("/note/listNotes").get(auth.requiresAdmin, note.listNotes);

  app.route("/note/updateNote").put(auth.requiresAdmin, note.updateNote);

  app.route("/note/deleteNote/:_id").delete(auth.requiresAdmin, note.deleteNote);

  return app;
};
