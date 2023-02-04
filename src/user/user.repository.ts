import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);
  constructor(private dataSource: DataSource, private jwtService:JwtService) {
    super(User, dataSource.createEntityManager());
  }

  async findAllUser() {
    try {
      return await this.find();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findOneUserName(username: string) {
    try {
      return await this.findOne({ where: { username } });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findOneUser(id: number) {
    try {
      return await this.findOne({ where: { id } });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async createUser(createData: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(createData);
      await queryRunner.commitTransaction();
    } catch (err){
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(id: number, updateData: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(User, id, updateData);
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUser(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
      .createQueryBuilder(User, 'user')
      .delete()
      .from(User)
      .where("id = :id", { id })
      .execute()
      
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
