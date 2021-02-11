import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import ListProviderAppointmentsService from "./ListProviderAppointmentsService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe("ListProviderAppointments", () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository
        );
    });

    it("should be able to list the appointments on a specific day", async () => {
        const firstAppointment = await fakeAppointmentsRepository.create({
            provider_id: "provider",
            date: new Date(2021, 4, 20, 14, 0, 0),
            user_id: "user",
        });

        const secondAppointment = await fakeAppointmentsRepository.create({
            provider_id: "provider",
            date: new Date(2021, 4, 20, 15, 0, 0),
            user_id: "user",
        });

        const appointments = await listProviderAppointments.execute({
            provider_id: "provider",
            year: 2021,
            month: 5,
            day: 20,
        });

        expect(appointments).toEqual([firstAppointment, secondAppointment]);
    });
});
