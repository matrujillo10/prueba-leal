import { Controller, Put, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InactivationService } from './inactivation.service';
import { Transaction } from '../entity/transaction.entity'

@Controller('transaction/inactivation')
export class InactivationController {

    constructor(
        private readonly inactivationService: InactivationService
    ) { }

    //-------------------------------------------
    // Inactivar transacciones
    //-------------------------------------------

    @MessagePattern({ role: 'transaction/inactivation', cmd: 'inactivate' })
    inactivateTransactionTCP(id: number) {
        return this.inactivationService.inactivateTransactionTCP(id);
    }

    @Put(':id')
    async inactivateTransactionHTTP(@Param('id') id): Promise<Transaction> {
        return this.inactivationService.inactivateTransactionHTTP(id);
    }
}
