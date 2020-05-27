import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './models/task-status.enum';
import { User } from '../auth/entities/user.entity';

const mockTaskRepo = () => ({
  getTasks: jest.fn().mockResolvedValue('value'),
});

const mockUser: any|User = {
  id: 1,
  username: 'Oleg',
};

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
          TasksService,
          {provide: TaskRepository, useFactory: mockTaskRepo}
        ],
    }).compile();

    service = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTasks', () => {
    it('gets all tasks from repo', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filter: GetTasksFilter = { status: TaskStatus.OPEN, search: 'just string' };
      const resValue = await service.getAllTasks(filter, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(resValue).toEqual('value');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully return task', async () => {
      const mockTask = { 
        title: 'Task title', 
        description: 'Task description'
      };
      taskRepository.findOne = jest.fn().mockResolvedValue(mockTask);
      const res = await service.getTaskById(1, mockUser);
      expect(res).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({where: {id: 1, userId: mockUser.id}})
    });
    it('throws error when task not found', async () => {
      taskRepository.findOne = jest.fn().mockResolvedValue(null);
      expect(service.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException); 
    });
  });

});
