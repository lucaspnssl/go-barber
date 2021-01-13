import { Router } from "express";

import CreateUserService from "../services/CreateUserService";
import UpdateAvatarService from "../services/UpdateUserAvatarService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

import multer from "multer";
import uploadConfig from "../config/upload";

import User from '../models/User';

const usersRouter = Router();
const upload = multer(uploadConfig);

function getUserWithoutPassword(user: User) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}

usersRouter.post("/", async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUser = new CreateUserService();
        const user = await createUser.execute({
            name,
            email,
            password,
        });

        return response.json(getUserWithoutPassword(user));
    } catch (e) {
        return response.status(400).json({ error: e.message });
    }
});

usersRouter.patch(
    "/avatar",
    ensureAuthenticated,
    upload.single("avatar"),
    async (request, response) => {
        try {
            const updateAvatarService = new UpdateAvatarService();

            const user = await updateAvatarService.execute({
                user_id: request.user.id,
                avatarFileName: request.file.filename,
            });

            return response.json(getUserWithoutPassword(user));
        } catch (e) {
            return response.status(400).json({ error: e.message });
        }
    }
);

export default usersRouter;
