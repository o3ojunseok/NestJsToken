import { Controller, Get, Post, Body, Param, ValidationPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('user')
export default class UserController {
  constructor(
    private readonly userService: UserService,
    ) {}

  @Get('list')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('list/:id')
  async findOne(@Param('id') id: number) {
    return await this.userService.findOne(id);
  }

  @Post('signup')
  async userSignUp(@Body(ValidationPipe) createData: CreateUserDto) {
    return await this.userService.signUp(createData);
  }

  @Put('update/:id')
  async updateUser(@Param('id') id: number,@Body(ValidationPipe) updateData: UpdateUserDto) {
    return await this.userService.update(id, updateData);
  }

  @Post('delete/:id')
  async deleteUser(@Param('id') id: number) {
   return await this.userService.delete(id);
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }
}
