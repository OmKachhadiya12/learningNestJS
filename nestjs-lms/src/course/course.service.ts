import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CourseService {

  constructor(@InjectRepository(Course) private readonly courseRepository: Repository<Course>) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      level: createCourseDto.level,
      price: createCourseDto.price
    });

    return await this.courseRepository.save(course);
  }

  findAll() {
    return `This action returns all course`;
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
