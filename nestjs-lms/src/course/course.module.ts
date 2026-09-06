import { Module } from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CourseController } from './course.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course])
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
