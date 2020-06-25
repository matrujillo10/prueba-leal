import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InactivationModule } from './inactivation/inactivation.module';

@Module({
  imports: [TypeOrmModule.forRoot(), InactivationModule],
})
export class AppModule {}
