import { startOfHour } from "date-fns";

import Appointment from "../infra/typeorm/entities/Appointment";

import AppError from "@shared/errors/AppError";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    public async execute({ provider_id, date }: IRequest): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

        if (await this.appointmentsRepository.findByDate(appointmentDate))
            throw new AppError("This appointment is already booked");

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;