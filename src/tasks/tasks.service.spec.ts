import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';
import { typeOrmConfig } from '../config/typeorm.config';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([
            TaskRepository
          ]),
          AuthModule,
        ],
        providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
