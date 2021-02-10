import { getRepository, Not, Repository } from "typeorm";
import User from "../entities/User";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IFindAllProvidersDTO from "@modules/users/dtos/IFindAllProvidersDTO";

class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findAllProviders({
        except_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        return except_user_id
            ? await this.ormRepository.find({
                  where: {
                      id: Not(except_user_id),
                  },
              })
            : await this.ormRepository.find();
    }

    public async findById(id: string): Promise<User | undefined> {
        return await this.ormRepository.findOne(id);
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return await this.ormRepository.findOne({
            where: { email },
        });
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(userData);

        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UsersRepository;
