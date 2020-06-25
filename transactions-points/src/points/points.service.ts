import { Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Transaction } from '../entity/transaction.entity';

@Injectable()
export class PointsService {
    private logger = new Logger('PointsService');
    
    constructor(
        @Inject('POINTS_CLIENT')
        private readonly client: ClientProxy,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) {}
    

    async pointsTCP(user_id: string) {
      return this.transactionRepository
                .createQueryBuilder("TRANSACTION")
                .select("SUM(TRANSACTION.points)", "points_sum")
                .where("user_id = :user_id")
                .setParameter("user_id", user_id)
                .andWhere("status = 1")
                .getRawOne();
    }

    async pointsHTTP(user_id: string) {
      try {
        return await this.client.send({ role: 'transaction/points', cmd: 'points' }, user_id)
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
