import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateAvatarService from '@modules/users/services/UpdateUserAvatarService';
import User from '../../typeorm/entities/User';

export default class UserAvatarController {
    private getUserWithoutPassword(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
            avatar: user.avatar,
        };
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const updateAvatarService = container.resolve(UpdateAvatarService);

        const user = await updateAvatarService.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        return response.json({
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
            avatar: user.avatar,
        });
    }
}