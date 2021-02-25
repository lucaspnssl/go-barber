import { startOfHour, isBefore, getHours, format } from "date-fns";
import { injectable, inject } from "tsyringe";

import Appointment from "../infra/typeorm/entities/Appointment";

import AppError from "@shared/errors/AppError";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository,

        @inject("NotificationsRepository")
        private notificationsRepository: INotificationsRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({
        provider_id,
        date,
        user_id,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        if (user_id === provider_id) {
            throw new AppError("Can't create an appointment with yourself");
        }

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError("Can't create an appointment on a past date.");
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                "You can only create appointments between 8:00AM and 5:00PM"
            );
        }

        if (await this.appointmentsRepository.findByDate(appointmentDate, provider_id))
            throw new AppError("This appointment is already booked");

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
            user_id,
        });

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${format(
                appointmentDate,
                "dd/MM/yyyy 'às' HH:mm'h'"
            )}`,
        });

        await this.cacheProvider.invalidate(
            `provider-appointments:${provider_id}:${format(
                appointmentDate,
                "yyyy-M-d"
            )}`
        );

        return appointment;
    }
}

export default CreateAppointmentService;
