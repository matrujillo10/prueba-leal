import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { Transaction } from '../entity/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([{
      name: 'POINTS_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4005, // Microservicio de historico
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
  controllers: [PointsController],
  providers: [PointsService]
})
export class PointsModule {}
