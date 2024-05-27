import { FindUsersDto } from './dto/find-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DeleteResult, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import _ from 'lodash';
import { IServiceResponse } from '@app/rabbit';
import { IPagination, PaginationDto } from '@app/common';
import { Database } from '@app/database';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, Database.PRIMARY)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(
    createDto: CreateUserDto,
  ): Promise<IServiceResponse<UserEntity>> {
    try {
      const user = this.userRepository.create(createDto);
      const result = await this.userRepository.save(user);
      return {
        state: !!result,
        data: result,
        message: 'user.created',
      };
    } catch (error) {
      return {
        state: false,
        data: error.detail,
        message: 'user.created-fail',
      };
    }
  }

  async findAll({
    limit,
    page,
    phone,
    company,
    email,
  }: FindUsersDto): Promise<IServiceResponse<IPagination<UserEntity>>> {
    limit = limit || 20;
    page = page || 1;
    const where = [];
    if (company) {
      where.push({ 'company.id': company } as any);
    }
    if (phone) {
      where.push({ phone } as any);
    }
    if (email) {
      where.push({ email } as any);
    }
    console.log('where', where);
    try {
      const users = await this.userRepository.find({
        where: where,
        skip: (page - 1) * limit,
        take: limit,
      });
      const usersCount = await this.userRepository.count({
        where: where,
      });
      return {
        state: true,
        data: {
          limit: limit,
          page: page,
          items: users,
          total: Math.ceil(usersCount / limit),
        },
      };
    } catch (error) {
      console.log('error', error);
      return {
        state: true,
        data: error,
      };
    }
  }
  async findById(id: string): Promise<IServiceResponse<UserEntity>> {
    console.log('findOneBy', id);
    try {
      const user = await this.userRepository.findOneBy({ id });
      return {
        state: !!user,
        data: user,
        message: !!user ? 'user.finded' : 'user.notfound',
      };
    } catch (error) {
      console.log('error', error);
      return {
        state: false,
        data: error.detail,
        message: 'user.notfound',
      };
    }
  }

  async findByPhone(phone: string): Promise<IServiceResponse<UserEntity>> {
    const user = await this.userRepository.findOneBy({ phone });
    return {
      state: !!user,
      data: user,
      message: !!user ? 'user.finded' : 'user.notfound',
    };
  }

  async update(
    id: string,
    updateDto: UpdateUserDto,
  ): Promise<IServiceResponse<UserEntity>> {
    const { state, data: user } = await this.findById(id);
    if (state) {
      Object.assign(user, updateDto);
      const updatedUser = await this.userRepository.save(user);
      return {
        state: !!updatedUser,
        data: updatedUser,
        message: 'user.updated',
      };
    } else {
      return {
        state: false,
        data: null,
        message: 'user.update-fail',
      };
    }
  }

  async delete(id: string): Promise<IServiceResponse<DeleteResult>> {
    console.log('delete service id', id);
    try {
      const result = await this.userRepository.delete({ id });
      console.log('delete user', result);
      return {
        state: !!result,
        data: result,
        message: !!result ? 'user.deleted' : 'user.notfound',
      };
    } catch (error) {
      console.log('error', error);
      return {
        state: false,
        data: error.detail,
        message: 'user.notfound',
      };
    }
  }
}
