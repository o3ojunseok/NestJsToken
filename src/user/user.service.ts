import { InternalServerErrorException, Injectable, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    ) {}

  async findAll() {
    try {
      return await this.userRepository.findAllUser();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.userRepository.findOneUser(id);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async signUp(createData: CreateUserDto) {
    const user = await this.userRepository.findOneUserName(createData.username);

    if (user) {
      throw new UnauthorizedException('already exist user!');
    }
    try {
      const hashedPassword = await bcrypt.hash(createData.password, 10);
      const user = new User();
      user.username = createData.username;
      user.password = hashedPassword;

      await this.userRepository.createUser(user);

      return user;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
}

  async login(loginData: LoginUserDto) {
    const user = await this.userRepository.findOneUserName(loginData.username);
    if (!user) {
      throw new NotFoundException('who are you?');
    } 
    const equalPassword = await bcrypt.compare(loginData.password, user.password);
    if (!equalPassword) {
      throw new UnauthorizedException('incorrect your password');
    }
    try {
      const { password, ...result } =  user;
      const accessToken = await this.jwtService.sign(result);
      result['accessToken'] = accessToken;

      return result;

    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
  
  async update(id: number, updateData: UpdateUserDto) {
    await this.userRepository.findOneUser(id);

    try {
      await this.userRepository.updateUser(id, updateData);
      return updateData;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }


  async delete(id: number) {
    const user = await this.userRepository.findOneUser(id);
    if (!user) {
      throw new NotFoundException('user not exist.');
    } 

    try {
      await this.userRepository.deleteUser(id);
      return `delete successfully ${id}` 
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
