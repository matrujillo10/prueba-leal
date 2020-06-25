import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InactivationController } from './inactivation.controller';
import { InactivationService } from './inactivation.service';
import { Transaction } from '../entity/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([{
      name: 'INACTIVATE_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4003, // Microservicio de inactivación
      }
    }]),
  ],
  controllers: [InactivationController],
  providers: [InactivationService]
})
export class InactivationModule {}
