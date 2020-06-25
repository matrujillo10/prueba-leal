import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricalController } from './historical.controller';
import { HistoricalService } from './historical.service';
import { Transaction } from '../entity/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([{
      name: 'HISTORICAL_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4004, // Microservicio de historico
      }
    }]),
    ClientsModule.register([{
      name: 'AUTH_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4001
      }
    }])
  ],
  controllers: [HistoricalController],
  providers: [HistoricalService]
})
export class HistoricalModule {}
