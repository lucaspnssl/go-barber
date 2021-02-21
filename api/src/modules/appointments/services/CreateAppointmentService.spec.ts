import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider.";
import AppError from "@shared/errors/AppError";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateApppointmentService from "./CreateAppointmentService";

let fakeAppointmentRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateApppointmentService;

describe("CreateApppointment", () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createAppointment = new CreateApppointmentService(
            fakeAppointmentRepository,
            fakeNotificationsRepository,
            fakeCacheProvider
        );
    });

    it("should be able to create a new appointment", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2021, 4, 10, 15),
            provider_id: "provider",
            user_id: "user",
        });

        expect(appointment).toHaveProperty("id");
        expect(appointment.provider_id).toBe("provider");
    });

    it("should not be able to create two appointments on the same time", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12).getTime();
        });

        const appointmentDate = new Date(2021, 4, 10, 15);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: "1",
            user_id: "user",
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: "1",
                user_id: "user",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment on a past date", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2021, 4, 10, 11),
                provider_id: "provider",
                user_id: "user",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment with same user as provider", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2021, 4, 10, 13),
                provider_id: "provider",
                user_id: "provider",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment before 8am and afeter 5pm", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2021, 4, 11, 7),
                provider_id: "provider",
                user_id: "user",
            })
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2021, 4, 11, 18),
                provider_id: "provider",
                user_id: "user",
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
