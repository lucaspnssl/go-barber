import { Router } from "express";
import { startOfHour, parseISO } from "date-fns";
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from "../../modules/appointments/repositories/AppointmentsRepository";
import CreateAppointmentService from "../../modules/appointments/services/CreateAppointmentService";

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get("/", async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    return response.json(await appointmentsRepository.find());
});

appointmentsRouter.post("/", async (request, response) => {
    const { provider_id, date } = request.body;
    const parsedDate = startOfHour(parseISO(date));

    return response.json(
        await new CreateAppointmentService().execute({
            provider_id,
            date: parsedDate,
        })
    );
});

export default appointmentsRouter;
