import { Controller, Inject, Get, UseGuards, Headers, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
import { PointsService } from './points.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('transaction/points')
export class PointsController {

    constructor(
        @Inject('AUTH_CLIENT')
        private readonly client: ClientProxy,
        private readonly pointsService: PointsService
    ) { }

    //-------------------------------------------
    // Historico de transacciones
    //-------------------------------------------

    @MessagePattern({ role: 'transaction/points', cmd: 'points' })
    getPointsTCP(user_id): Promise<any> {
        return this.pointsService.pointsTCP(user_id);
    }

    @UseGuards(AuthGuard)
    @Get() 
    async getPointsHTTP(@Headers('authorization') auth): Promise<any> {
        const res = await this.client.send(
            { role: 'auth', cmd: 'check' },
            { jwt: auth.split(' ')[1]})
            .pipe(timeout(5000))
            .toPromise<any>();
        return await this.pointsService.pointsHTTP(res.user.user_id);
    }
}
