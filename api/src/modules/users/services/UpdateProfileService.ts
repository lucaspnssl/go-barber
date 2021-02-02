import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import User from "../infra/typeorm/entities/User";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import IUsersRepository from "../repositories/IUsersRepository";

interface IRequest {
    name: string;
    email: string;
    old_password?: string;
    password?: string;
    user_id: string;
}

@injectable()
export default class UpdateProfileService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("HashProvider")
        private hashProvider: IHashProvider
    ) {}

    public async execute({
        name,
        email,
        old_password,
        password,
        user_id,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError("User not found");
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(
            email
        );

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
            throw new AppError("E-Mail already in use");
        }

        user.name = name;
        user.email = email;

        if (password) {
            if (!old_password) {
                throw new AppError(
                    "You need to inform the old password to set a new password"
                );
            }

            if (!await this.hashProvider.compareHash(old_password, user.password)) {
                throw new AppError('Old password does not match.');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}
