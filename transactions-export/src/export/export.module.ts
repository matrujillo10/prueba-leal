import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'HISTORICAL_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4004, // Microservicio de historico
      }
    }]),
    ClientsModule.register([{
      name: 'EXPORT_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4006, // Microservicio de historico
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
  controllers: [ExportController],
  providers: [ExportService]
})
export class ExportModule {}
