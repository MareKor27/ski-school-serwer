import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservetionData } from './types/reservationData';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  private reservations: ReservetionData[] = [
    {
      id: 1,
      idClient: 1,
      idInstructor: 1,
      reservationDate: '2024-12-20T13:00:00Z',
      purchasedTime: 'TWOHOUR',
      participants: '3',
      ageOfParticipants: '20-40',
      advancement: 'Zawansowane',
      chosenEquipment: 'WŁASNY',
      additionalComments: '',
      insuranceInformation: '',
      createdAt: '2024-12-19T13:10:00Z',
    },
    {
      id: 2,
      idClient: 1,
      idInstructor: 2,
      reservationDate: '2024-12-21T14:00:00Z',
      purchasedTime: 'TWOHOUR',
      participants: '3',
      ageOfParticipants: '20-40',
      advancement: 'Zawansowane',
      chosenEquipment: 'WŁASNY',
      additionalComments: '',
      insuranceInformation: '',
      createdAt: '2024-12-19T13:10:00Z',
    },
    {
      id: 3,
      idClient: 2,
      idInstructor: 3,
      reservationDate: '2024-12-23T13:00:00Z',
      purchasedTime: 'TWOHOUR',
      participants: '3',
      ageOfParticipants: '20-40',
      advancement: 'Zawansowane',
      chosenEquipment: 'WŁASNY',
      additionalComments: '',
      insuranceInformation: '',
      createdAt: '2024-12-19T13:10:00Z',
    },
  ];

  findOne(id: number) {
    const reservation = this.reservations.find(
      (reservation) => reservation.id == id,
    );
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  findAll(filters: {
    idClient?: number;
    idInstructor?: number;
    year?: number;
    month?: number;
    day?: number;
    weekday?: number;
    hour?: number;
  }) {
    return this.reservations.filter((reservation) => {
      let match = true;
      const reservationDate = new Date(reservation.reservationDate);

      if (
        filters.idClient &&
        reservation.idClient !== Number(filters.idClient)
      ) {
        match = false;
      }

      if (
        filters.idInstructor &&
        reservation.idInstructor !== Number(filters.idInstructor)
      ) {
        match = false;
      }

      if (
        filters.year &&
        reservationDate.getFullYear() !== Number(filters.year)
      ) {
        return false;
      }

      if (
        filters.month &&
        reservationDate.getMonth() !== Number(filters.month)
      ) {
        return false;
      }

      if (filters.day && reservationDate.getDate() !== Number(filters.day)) {
        return false;
      }

      if (
        filters.weekday &&
        reservationDate.getDay() !== Number(filters.weekday)
      ) {
        return false;
      }

      if (
        filters.hour &&
        reservationDate.getUTCHours() !== Number(filters.hour)
      ) {
        return false;
      }

      return match;
    });
  }

  createOne(createReservationDto: CreateReservationDto) {
    const reservationByHighestId = [...this.reservations].sort(
      (a, b) => b.id - a.id,
    );
    const newReservation = {
      id: reservationByHighestId[0].id + 1,
      ...createReservationDto,
      createAt: new Date(),
    };
    this.reservations.push(newReservation);
    return newReservation;
  }

  updateOne(id: number, updateReservationDto: UpdateReservationDto) {
    this.reservations = this.reservations.map((reservation) => {
      if (reservation.id == id) {
        return {
          ...reservation,
          ...updateReservationDto,
          updateAt: new Date(),
        };
      }
      return reservation;
    });
    return this.findOne(id);
  }

  deleteOne(id: number) {
    this.reservations = this.reservations.filter(
      (reservation) => reservation.id !== id,
    );
  }
}
