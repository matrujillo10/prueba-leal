import { Controller, Inject, Get, UseGuards, Headers, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
import { HistoricalService } from './historical.service';
import { Transaction } from '../entity/transaction.entity'
import { AuthGuard } from '../guards/auth.guard';

@Controller('transaction/historical')
export class HistoricalController {

    constructor(
        @Inject('AUTH_CLIENT')
        private readonly client: ClientProxy,
        private readonly historicalService: HistoricalService
    ) { }

    //-------------------------------------------
    // Historico de transacciones
    //-------------------------------------------

    @MessagePattern({ role: 'transaction/historical', cmd: 'historical' })
    getHistorical(user_id): Promise<Transaction[]> {
        return this.historicalService.historicalTCP(user_id);
    }

    @UseGuards(AuthGuard)
    @Get() 
    async historical(@Headers('authorization') auth): Promise<Transaction[]> {
        const res = await this.client.send(
            { role: 'auth', cmd: 'check' },
            { jwt: auth.split(' ')[1]})
            .pipe(timeout(5000))
            .toPromise<any>();
        return await this.historicalService.historicalHTTP(res.user.user_id);
    }
}
