import { Controller, Logger, Post, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    private logger = new Logger('UserController');

    constructor(private readonly userService: UserService) {}

    @MessagePattern({ role: 'user', cmd: 'get' })
    getUser(data: any): Promise<User> {
        return this.userService.findOne({ email: data.email });
    }

    @Post('register')
    register(@Body() user: User) {
        return this.userService.register(user);
    }
}
