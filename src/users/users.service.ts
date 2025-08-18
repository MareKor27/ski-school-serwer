import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './types/role';
import { UserModel } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  async findByEmail(email: string): Promise<UserModel | null> {
    return this.userModel.findOne({
      where: { email, status: { [Op.ne]: 'INACTIVE' } },
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserModel | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  findOneUser(id: number): Promise<UserModel | null> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async findAll(
    filters: {
      role?: Role;
      name?: string;
      email?: string;
      phone?: string;
    },
    page: number,
    size: number,
  ): Promise<[UserModel[], number]> {
    const limit = size;
    const offset = size * (page - 1);
    const whereConditions: any = { status: { [Op.ne]: 'INACTIVE' } };

    if (filters.role) {
      whereConditions.role = filters.role;
    }

    if (filters.name) {
      whereConditions.name = {
        [Op.iLike]: `%${filters.name}%`,
      };
    }

    if (filters.email) {
      whereConditions.email = {
        [Op.like]: `%${filters.email}%`,
      };
    }

    if (filters.phone) {
      whereConditions.phone = {
        [Op.like]: `%${filters.phone}%`,
      };
    }

    // Wykonanie zapytania z dynamicznie utworzonymi warunkami
    const result = await this.userModel.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
    });

    return [result.rows, result.count];
  }

  async create(userData: CreateUserDto): Promise<UserModel> {
    return this.userModel.create(userData);
  }

  async updateOne(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserModel> {
    let affectedCount, affectedRows;
    try {
      [affectedCount, affectedRows] = await this.userModel.update(
        updateUserDto,
        {
          where: { id },
          returning: true,
          validate: true,
        },
      );
    } catch (error) {
      throw new HttpException(
        {
          message: [
            {
              property: 'email',
              constraints: {
                isEmail: 'Ten email już jest używany',
              },
            },
          ],
        },
        HttpStatus.CONFLICT,
      );
    }

    if (affectedCount === 0) {
      throw new Error(
        `User with id ${id} was not found or no changes were made.`,
      );
    }

    return affectedRows[0];
  }

  async delete(id: number): Promise<UserModel> {
    const user = await this.findOneUser(id);
    if (!user) {
      throw new Error('User not found xddd');
    }
    await user.destroy();
    return user;
  }
}
