import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import ResetPasswordService from "./ResetPasswordService";

let resetPassword: ResetPasswordService;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe("ResetPassword", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        );
    });

    it("should be able to reset password", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456",
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

        await resetPassword.execute({
            password: "1234567",
            token,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);
        expect(updatedUser?.password).toBe("1234567");
        expect(generateHash).toHaveBeenCalledWith("1234567");
    });

    it("should not be able to reset the password with non existing token", async () => {
        await expect(
            resetPassword.execute({
                token: "non-existing-token",
                password: "1234567",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to reset the password with non existing user", async () => {
        const { token } = await fakeUserTokensRepository.generate(
            "non-existing-user"
        );

        await expect(
            resetPassword.execute({
                token,
                password: "1234567",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to reset the password if passed more than 2 hours", async () => {
        const user = await fakeUsersRepository.create({
            name: "John Doe",
            email: "johndoe@exemple.com",
            password: "123456",
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassword.execute({
                password: "1234567",
                token,
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
