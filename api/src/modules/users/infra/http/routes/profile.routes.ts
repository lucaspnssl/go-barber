import { Router } from "express";
import ProfileController from "../controllers/ProfileController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const profileRouter = Router();
const profileControler = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put("/", profileControler.update);
profileRouter.get("/", profileControler.show);

export default profileRouter;
