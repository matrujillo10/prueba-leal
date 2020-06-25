import { Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Transaction } from '../entity/transaction.entity';

@Injectable()
export class HistoricalService {
    private logger = new Logger('HistoricalService');
    
    constructor(
        @Inject('HISTORICAL_CLIENT')
        private readonly client: ClientProxy,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) {}
    

    async historicalTCP(user_id: string) {
      return this.transactionRepository.find({
          where: {
            user_id: user_id
          },
          order: {
              created_date: "DESC"
          }
      });
    }

    async historicalHTTP(user_id: string) {
      try {
        return await this.client.send({ role: 'transaction/historical', cmd: 'historical' }, user_id)
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
}
