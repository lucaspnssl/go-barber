import { Router } from "express";
import { container } from 'tsyringe';

import CreateUserService from "@modules/users/services/CreateUserService";
import UpdateAvatarService from "@modules/users/services/UpdateUserAvatarService";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import multer from "multer";
import uploadConfig from "@config/upload";

import User from '../../typeorm/entities/User';
import UsersRepository from "../../typeorm/repositories/UsersRepository";

const usersRouter = Router();
const upload = multer(uploadConfig);

function getUserWithoutPassword(user: User) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        avatar: user.avatar,
    };
}

usersRouter.post("/", async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({
        name,
        email,
        password,
    });

    return response.json(getUserWithoutPassword(user));
});

usersRouter.patch(
    "/avatar",
    ensureAuthenticated,
    upload.single("avatar"),
    async (request, response) => {
        const updateAvatarService = container.resolve(UpdateAvatarService);

        const user = await updateAvatarService.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        return response.json(getUserWithoutPassword(user));
    }
);

export default usersRouter;
