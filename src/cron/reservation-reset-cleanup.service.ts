import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AppointmentModel } from 'src/appointments/models/appointment.model';
import { BookingReservationModel } from 'src/auth/model/booking-confirmation.model';
import { ReservationModel } from 'src/reservations/models/reservation.model';

@Injectable()
export class ReservastionResetCleanupService {
  private readonly logger = new Logger(ReservastionResetCleanupService.name);

  constructor(
    @InjectModel(BookingReservationModel)
    private readonly bookingReservationModel: typeof BookingReservationModel,
    @InjectModel(AppointmentModel)
    private readonly appointmentModel: typeof AppointmentModel,
    @InjectModel(ReservationModel)
    private readonly reservationModel: typeof ReservationModel,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanupEveryMinute() {
    this.logger.log('Czyszczenie wygasłych linków z rezerwacji');
    const now = new Date();

    const bookingReservation = await this.bookingReservationModel.findAll({
      where: {
        exp: { [Op.lt]: now },
      },
    });

    if (bookingReservation.length === 0) {
      this.logger.log('Brak wygasłych rekordów rezerwacji do usunięcia.');
      return;
    }

    const reservationIds = bookingReservation
      .map((r) => r.reservationId)
      .filter((id) => id !== null);

    console.log(reservationIds);

    const appointments = await this.appointmentModel.findAll({
      where: {
        reservationId: { [Op.in]: reservationIds },
      },
    });

    await Promise.all(
      appointments.map(async (appointment) => {
        appointment.reservationId = null;
        await appointment.save();
      }),
    );

    const reservations = await this.reservationModel.destroy({
      where: {
        id: { [Op.in]: reservationIds },
      },
    });

    console.log(reservations);

    await this.bookingReservationModel.destroy({
      where: { reservationId: { [Op.in]: reservationIds } },
    });

    this.logger.log(
      `Znaleziono ${bookingReservation.length} wygasłych rekordów rezerwacji.`,
    );

    // const deleted = await this.bookingReservationModel.destroy({
    //   where: {
    //     exp: { [Op.lt]: now },
    //   },
    // });
    // this.logger.log(`Usunięto ${deleted} wygasłych rekordów rezerwacji.`);
  }
}
