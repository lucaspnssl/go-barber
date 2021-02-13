import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ProfileController from "../controllers/ProfileController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const profileRouter = Router();
const profileControler = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put(
    "/",
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            old_password: Joi.string(),
            password: Joi.string(),
            password_confirmation: Joi.string().valid(Joi.ref("password")),
        },
    }),
    profileControler.update
);
profileRouter.get("/", profileControler.show);

export default profileRouter;
