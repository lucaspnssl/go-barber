import { Router } from "express";
import { startOfHour, parseISO } from "date-fns";
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentService from "../services/CreateAppointmentService";

const appointmentsRouter = Router();

appointmentsRouter.get("/", async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    return response.json(await appointmentsRepository.find());
});

appointmentsRouter.post("/", async (request, response) => {
    try {
        const { provider_id, date } = request.body;
        const parsedDate = startOfHour(parseISO(date));

        return response.json(
            await new CreateAppointmentService().execute({
                provider_id,
                date: parsedDate,
            })
        );

    } catch (e) {
        return response.status(400).json({ error: e.message });
    }
});

export default appointmentsRouter;
