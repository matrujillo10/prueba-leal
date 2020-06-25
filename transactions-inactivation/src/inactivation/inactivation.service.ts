import { Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Transaction } from '../entity/transaction.entity';

@Injectable()
export class InactivationService {
    private logger = new Logger('InactivationService');
    
    constructor(
        @Inject('INACTIVATE_CLIENT')
        private readonly createClient: ClientProxy,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) {}
    

    async inactivateTransactionHTTP(id: number) {
      try {
        return await this.createClient.send({ role: 'transaction/inactivation', cmd: 'inactivate' }, id)
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

    async inactivateTransactionTCP(id: number) {
      await this.transactionRepository.update(
        { id: id },
        {
          id: id,
          status: 0,
        }
      )
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
