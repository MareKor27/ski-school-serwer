import { Injectable, NotFoundException } from '@nestjs/common';
import { InstructorAvailability } from './types/instructorAvailability';
import { CreateAvailabilityDto } from './dto/createAvailability.dto';
import { UpdateAvailabilityDto } from './dto/updateAvailability.dto';

@Injectable()
export class InstructorAvailabilityService {
  private avalibilites: InstructorAvailability[] = [
    {
      id: 1,
      idInstructor: 2,
      availabilityDate: new Date('2024-12-19T13:00:00Z'),
      IdReservation: 1,
      createAt: new Date('2024-12-19T13:10:00Z'),
    },
    {
      id: 2,
      idInstructor: 2,
      availabilityDate: new Date('2024-12-19T13:10:00Z'),
      IdReservation: 2,
      createAt: new Date('2024-12-19T13:10:00Z'),
    },
    {
      id: 3,
      idInstructor: 2,
      availabilityDate: new Date('2024-12-19T13:10:00Z'),
      IdReservation: 3,
      createAt: new Date('2024-12-19T13:10:00Z'),
    },
  ];

  findOne(id: number) {
    const user = this.avalibilites.find((avalibility) => avalibility.id == id);
    if (!user) throw new NotFoundException('Avalibilite not found f1');
    return user;
  }

  findAll(filters: {
    idInstructor?: number;
    year?: number;
    month?: number;
    day?: number;
    weekday?: number;
    hour?: number;
  }) {
    return this.avalibilites.filter((avalibility) => {
      let match = true;
      const avalibilityDate = new Date(avalibility.availabilityDate);
      if (
        filters.idInstructor &&
        avalibility.idInstructor !== Number(filters.idInstructor)
      ) {
        match = false;
      }

      if (
        filters.year &&
        avalibilityDate.getFullYear() !== Number(filters.year)
      ) {
        return false;
      }

      if (
        filters.month &&
        avalibilityDate.getMonth() !== Number(filters.month)
      ) {
        return false;
      }

      if (filters.day && avalibilityDate.getDate() !== Number(filters.day)) {
        return false;
      }

      if (
        filters.weekday &&
        avalibilityDate.getDay() !== Number(filters.weekday)
      ) {
        return false;
      }

      if (
        filters.hour &&
        avalibilityDate.getUTCHours() !== Number(filters.hour)
      ) {
        return false;
      }
    });
  }

  createOne(createAvailabilityDto: CreateAvailabilityDto) {
    //MUST HAVE TO FINAL VERSION - CAPTCHA VALIDATION FROM BOTS
    const userByHighestId = [...this.avalibilites].sort((a, b) => b.id - a.id);
    const newUser = {
      id: userByHighestId[0].id + 1,
      ...createAvailabilityDto,
      createAt: new Date(),
      //MUST HAVE TO FINAL VERSION - SHA@256
    };
    this.avalibilites.push(newUser);
    return newUser;
    //MUST HAVE TO FINAL VERSION - CHECK UNIQUE VALUE OF EMAIL & PHONENUMBER
  }

  updateOne(id: number, updateAvailabilityDto: UpdateAvailabilityDto) {
    this.avalibilites = this.avalibilites.map((avalibility) => {
      if (avalibility.id == id) {
        return {
          ...avalibility,
          ...updateAvailabilityDto,
          updateAt: new Date(),
        };
      }
      return avalibility;
    });
    return this.findOne(id);
  }

  deleteOne(id: number) {
    this.avalibilites = this.avalibilites.filter((avalibility) => {
      return avalibility.id !== id;
    });
  }
}
