import { parseISO, startOfHour } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { provider_id, date } = request.body;
        const parsedDate = startOfHour(parseISO(date));
    
        return response.json(
            await container.resolve(CreateAppointmentService).execute({
                provider_id,
                date: parsedDate,
            })
        );
    }
}