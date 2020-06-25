import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessagePattern } from '@nestjs/microservices';
import { CreationService } from './creation.service';
import { Transaction } from '../entity/transaction.entity'

@Controller('transaction/creation')
export class CreationController {

    constructor(
        private readonly creationService: CreationService
    ) { }

    //-------------------------------------------
    // Crear transacciones
    //-------------------------------------------

    @MessagePattern({ role: 'transaction/creation', cmd: 'create' })
    createTransactions(transactions: Transaction[]) {
        return this.creationService.save(transactions);
    }

    @Post() 
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req: any, file: any, cb: any) => {
            if (file.mimetype.match(/\/(csv)$/)) {
                cb(null, true);
            } else {
                cb(
                    new HttpException(
                        `Unsupported file type`,
                        HttpStatus.BAD_REQUEST
                    ),
                    false
                );
            }
        }
    }))
    async createTransaction(@UploadedFile() file): Promise<Transaction[]> {
        return this.creationService.createTransactions(file);
    }
}
