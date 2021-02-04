import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import ListProvidersService from "./ListProvidersService";

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe("ListProviders", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        listProviders = new ListProvidersService(fakeUsersRepository);
    });

    it("should be able to list the providers", async () => {
        const firstUser = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456",
        });

        const secondUser = await fakeUsersRepository.create({
            name: "Jack Doe",
            email: "jackdoe@example.com",
            password: "123456",
        });

        const loggedUser = await fakeUsersRepository.create({
            name: "Jim Doe",
            email: "Jimdoe@example.com",
            password: "123456",
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([firstUser, secondUser]);
    });
});
