import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateProfileService from "./UpdateProfileService";

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;

describe("UpdateProfile", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider
        );
    });

    it("it should be able to update the profile", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456",
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: "Jack Doe",
            email: "jackdoe@example.com",
        });

        expect(updatedUser.name).toBe("Jack Doe");
        expect(updatedUser.email).toBe("jackdoe@example.com");
    });

    it("should not be able to change to another user email", async () => {
        await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456",
        });

        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "test@exemple.com",
            password: "123456",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "John Doe",
                email: "johndoe@exemple.com",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should be able to update the password", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456",
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: "John Doe",
            email: "johndoe@example.com",
            password: "1234567",
            old_password: "123456",
        });

        expect(updatedUser.password).toBe("1234567");
    });

    it("should not be able to update the password without old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "John Doe",
                email: "johndoe@example.com",
                password: "1234567",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to update the password with wrong old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "John Doe",
                email: "johndoe@example.com",
                password: "1234567",
                old_password: "wrong-password",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to update profile with non-existing user", async () => {
        await expect(
            updateProfile.execute({
                user_id: "non-existing-user",
                name: "John Doe",
                email: "johndoe@example.com",
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
