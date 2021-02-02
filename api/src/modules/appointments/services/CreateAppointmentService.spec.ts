import AppError from "@shared/errors/AppError";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateApppointmentService from "./CreateAppointmentService";

let fakeAppointmentRepository: FakeAppointmentsRepository;
let createAppointment: CreateApppointmentService;

describe("CreateApppointment", () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentsRepository();
        createAppointment = new CreateApppointmentService(
            fakeAppointmentRepository
        );
    });

    it("should be able to create a new appointment", async () => {
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: "1",
        });

        expect(appointment).toHaveProperty("id");
        expect(appointment.provider_id).toBe("1");
    });

    it("should not be able to create two appointments on the same time", async () => {
        const appointmentDate = new Date();

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: "1",
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: "1",
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
