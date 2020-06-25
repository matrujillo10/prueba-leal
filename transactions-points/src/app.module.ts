import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsModule } from './points/points.module';

@Module({
  imports: [TypeOrmModule.forRoot(), PointsModule],
})
export class AppModule {}
