import { Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import * as xl from 'excel4node';

@Injectable()
export class ExportService {
    private logger = new Logger('ExportService');
    
    constructor(
        @Inject('EXPORT_CLIENT')
        private readonly client: ClientProxy,
        @Inject('HISTORICAL_CLIENT')
        private readonly historicalClient: ClientProxy
    ) {}
    

    async exportTCP(user_id: string) {
      try {
        const historical = await this.historicalClient.send({ role: 'transaction/historical', cmd: 'historical' }, user_id)
        .pipe(
          timeout(5000), 
          catchError(err => {
          if (err instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(err);
        }),)
        .toPromise();

        // TODO: Convertir a excel
        var wb = new xl.Workbook();
        var ws = wb.addWorksheet('Sheet 1');

        var style = wb.createStyle({
          font: {
            size: 12,
          }
        });

        var i = 1;
        var j = 1;
        for (const key in historical[0]) {
          ws.cell(i, j)
            .string(key)
            .style(style);
          j++;
        }
        i++;

        for (const transaction of historical) {
          j = 1;
          for (const key in transaction) {
            if (transaction.hasOwnProperty(key)) {
              const element = transaction[key];
              switch (typeof(element)) {
                case "number":
                  ws.cell(i, j)
                  .number(element)
                  .style(style);
                  break;
                default:
                  ws.cell(i, j)
                  .string(element)
                  .style(style);
                  break;
              }
            }
            j++;
          }
          i++;
        }

        return await wb.writeToBuffer();
      } catch(e) {
        Logger.log(e);
        throw e;
      }
    }

    async exportHTTP(user_id: string) {
      try {
        return await this.client.send({ role: 'transaction/export', cmd: 'export' }, user_id)
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
