import { Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as csv from 'csvtojson';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Transaction } from '../entity/transaction.entity';

@Injectable()
export class CreationService {
    private logger = new Logger('CreationService');
    
    constructor(
        @Inject('CREATE_CLIENT')
        private readonly createClient: ClientProxy,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) {}
    

    async createTransactions(file: Express.Multer.File) {
      const data = await csv().fromString(Buffer.from(file.buffer).toString('utf-8'));
      try {
          return await this.createClient.send({ role: 'transaction/creation', cmd: 'create' }, { data })
          .pipe(
            timeout(5000), 
            catchError(err => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),)
          .toPromise();
        } catch(e) {
          Logger.log(e);
          throw e;
        }
    }

    async save(transactions) {
      const txts: Transaction[] = this.transactionRepository.create(transactions.data)
      return await this.transactionRepository.save<Transaction>(txts)
      .then(() => {
          return {
              status: 'ok'
          };
      })
      .catch((err: any) => {
          Logger.error(err);
          throw err;
      })
    }
}
