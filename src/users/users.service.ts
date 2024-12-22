import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserData } from './types/userData';
import { Role } from './types/role';

@Injectable()
export class UsersService {
  private users: UserData[] = [
    {
      id: 1,
      nameSurname: 'M K',
      password: '',
      email: 'mk@wp.pl',
      phoneNumber: '+48 123 456 781',
      role: 'ADMIN',
      informationOne: '',
      informationTwo: '',
      informationThree: '',
      createAt: new Date('2024-12-19T13:10:00Z'),
    },
    {
      id: 2,
      nameSurname: 'M J',
      password: '',
      email: 'mj@wp.pl',
      phoneNumber: '+48 123 456 782',
      role: 'ADMIN',
      informationOne: '',
      informationTwo: '',
      informationThree: '',
      createAt: new Date('2024-12-19T13:10:00Z'),
    },
    {
      id: 3,
      nameSurname: 'Instr 1',
      password: '',
      email: 'instr1@wp.pl',
      phoneNumber: '+48 123 456 783',
      role: 'INSTRUCTOR',
      informationOne: '',
      informationTwo: '',
      informationThree: '',
      createAt: new Date('2024-12-19T13:10:00Z'),
    },
    {
      id: 4,
      nameSurname: 'Instr 2',
      password: '',
      email: 'instr2@wp.pl',
      phoneNumber: '+48 123 456 784',
      role: 'INSTRUCTOR',
      informationOne: '',
      informationTwo: '',
      informationThree: '',
      createAt: new Date('2024-12-19T13:10:00Z'),
    },
    {
      id: 5,
      nameSurname: 'Instr 3',
      password: '',
      email: 'instr3@wp.pl',
      phoneNumber: '+48 123 456 785',
      role: 'INSTRUCTOR',
      informationOne: '',
      informationTwo: '',
      informationThree: '',
      createAt: new Date('2024-12-19T13:10:00Z'),
    },
    {
      id: 6,
      nameSurname: 'clinet 1',
      password: '',
      email: 'client@wp.pl',
      phoneNumber: '+48 123 456 786',
      role: 'CLIENT',
      informationOne: '',
      informationTwo: '',
      informationThree: '',
      createAt: new Date('2024-12-19T13:10:00Z'),
    },
  ];

  findOne(id: number) {
    const user = this.users.find((user) => user.id == id);
    if (!user) throw new NotFoundException('User not found f1');
    // const { nameSurname, email, phoneNumber } = user;
    // return { nameSurname, email, phoneNumber };
    return user;
  }

  findAll(filters: {
    role?: Role;
    nameSurname?: string;
    email?: string;
    phoneNumber?: string;
  }) {
    return this.users.filter((user) => {
      let match = true;

      if (filters.role && user.role !== filters.role) {
        match = false;
      }

      if (
        filters.nameSurname &&
        !user.nameSurname
          .toLowerCase()
          .includes(filters.nameSurname.toLowerCase())
      ) {
        match = false;
      }

      if (
        filters.email &&
        !user.email.toLowerCase().includes(filters.email.toLowerCase())
      ) {
        match = false;
      }

      if (
        filters.phoneNumber &&
        !user.phoneNumber.includes(filters.phoneNumber)
      ) {
        match = false;
      }

      return match;
    });

    // if (filters.role) {
    //   const rolesArray = this.users.filter(
    //     (user) => user.role === filters.role,
    //   );
    //   if (rolesArray.length === 0)
    //     throw new NotFoundException('User not found fA');
    //   return rolesArray;
    // }
    // return this.users;
  }

  createOne(createUserDto: CreateUserDto) {
    //MUST HAVE TO FINAL VERSION - CAPTCHA VALIDATION FROM BOTS
    const userByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = {
      id: userByHighestId[0].id + 1,
      ...createUserDto,
      createAt: new Date(),
      //MUST HAVE TO FINAL VERSION - SHA@256
      password: '123',
    };
    this.users.push(newUser);
    return newUser;
    //MUST HAVE TO FINAL VERSION - CHECK UNIQUE VALUE OF EMAIL & PHONENUMBER
  }

  updateOne(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id == id) {
        return {
          ...user,
          ...updateUserDto,
          updateAt: new Date(),
        };
      }
      return user;
    });
    return this.findOne(id);
  }

  deleteOne(id: number) {
    this.users = this.users.filter((user) => {
      return user.id !== id;
    });
  }
}
