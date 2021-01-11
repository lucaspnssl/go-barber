import { Router } from "express";
import { startOfHour, parseISO } from "date-fns";

import AppointmentsRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentService from "../services/CreateAppointmentService";

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get("/", (request, response) => {
    return response.json(appointmentsRepository.all());
});

appointmentsRouter.post("/", (request, response) => {
    try {
        const { provider, date } = request.body;
        const parsedDate = startOfHour(parseISO(date));

        return response.json(
            new CreateAppointmentService(appointmentsRepository).execute({
                provider,
                date: parsedDate,
            })
        );

    } catch (e) {
        return response.status(400).json({ error: e.message });
    }
});

export default appointmentsRouter;
