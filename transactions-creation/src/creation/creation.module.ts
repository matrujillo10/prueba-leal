import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreationController } from './creation.controller';
import { CreationService } from './creation.service';
import { Transaction } from '../entity/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([{
      name: 'CREATE_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4002, // Microservicio de creación
      }
    }]),
  ],
  controllers: [CreationController],
  providers: [CreationService]
})
export class CreationModule {}
