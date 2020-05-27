import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';
import { TasksService } from './tasks.service';
import { typeOrmConfig } from '../config/typeorm.config';

describe('Tasks Controller', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([
            TaskRepository
          ]),
          AuthModule,
        ],
        controllers: [TasksController],
        providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
