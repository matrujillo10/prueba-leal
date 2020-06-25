import { Controller, Inject, Get, UseGuards, Headers, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
import { ExportService } from './export.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('transaction/export')
export class ExportController {

    constructor(
        @Inject('AUTH_CLIENT')
        private readonly client: ClientProxy,
        private readonly exportService: ExportService
    ) { }

    //-------------------------------------------
    // Historico de transacciones
    //-------------------------------------------

    @MessagePattern({ role: 'transaction/export', cmd: 'export' })
    async exportHistoricalTCP(user_id) {
        return await this.exportService.exportTCP(user_id);
    }

    @UseGuards(AuthGuard)
    @Get() 
    async exportHistoricalHTTP(@Headers('authorization') auth, @Res() res: Response): Promise<any> {
        const aut_res = await this.client.send(
            { role: 'auth', cmd: 'check' },
            { jwt: auth.split(' ')[1]})
            .pipe(timeout(5000))
            .toPromise<any>();
        res.attachment('export.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res
                .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                .end(Buffer.from(await this.exportService.exportHTTP(aut_res.user.user_id), 'binary'));
    }
}
