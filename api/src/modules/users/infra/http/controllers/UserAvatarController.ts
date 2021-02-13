import { Request, Response } from "express";
import { container } from "tsyringe";

import UpdateAvatarService from "@modules/users/services/UpdateUserAvatarService";
import User from "../../typeorm/entities/User";
import { classToClass } from "class-transformer";

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response
    ): Promise<Response> {
        const updateAvatarService = container.resolve(UpdateAvatarService);

        const user = await updateAvatarService.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        return response.json(classToClass(user));
    }
}
