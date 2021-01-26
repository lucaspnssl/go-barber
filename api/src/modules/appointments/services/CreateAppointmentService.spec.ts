import AppError from "@shared/errors/AppError";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateApppointmentService from "./CreateAppointmentService";

describe("CreateApppointment", () => {
    it("should be able to create a new appointment", async () => {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateApppointmentService(
            fakeAppointmentRepository
        );

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: "1",
        });

        expect(appointment).toHaveProperty("id");
        expect(appointment.provider_id).toBe("1");
    });

    it("should not be able to create two appointments on the same time", async () => {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateApppointmentService(
            fakeAppointmentRepository
        );

        const appointmentDate = new Date();

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: "1",
        });

        expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: "1",
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
