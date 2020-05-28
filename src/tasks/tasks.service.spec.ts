import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './models/task-status.enum';
import { User } from '../auth/entities/user.entity';
import { UpdateStatus } from './dto/update-status.dto';

const mockTaskRepo = () => ({
  getTasks: jest.fn().mockResolvedValue('value'),
});

const mockUser: any|User = {
  id: 1,
  username: 'Test_user',
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

  describe('createTask', () => {

    it('return task after creation', async () => {
      const mockTask = { 
        title: 'Task title', 
        description: 'Task description',
      };
      const mockTaskResult = { 
        title: 'Task title', 
        description: 'Task description',
        status: TaskStatus.OPEN
      };
      taskRepository.createTask = jest.fn().mockResolvedValue(mockTaskResult);
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const res = await service.createTask(mockTask, mockUser);
      expect(res).toEqual(mockTaskResult);
      expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser);
    });

  });

  describe('deleteTaskById', () => {

    it('task successfully deleted', async () => {
      taskRepository.delete = jest.fn().mockResolvedValue({affected: 1});
      expect(service.deleteTaskById(1, mockUser)).resolves.toEqual({result: true}); 
    });

    it('throw error when task not fount', async () => {
      taskRepository.delete = jest.fn().mockResolvedValue({affected: 0});
      expect(service.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException); 
    });

  });

  describe('updateTaskStatus', () => {

    const mockNewStatus: UpdateStatus = {
      id: 1,
      status: TaskStatus.IN_PROGRESS
    };

    const mockOldStatus = { 
      title: 'Task title', 
      description: 'Task description',
      status: TaskStatus.OPEN,
      save: jest.fn()
    };

    it('task status successfully updated', async () => {
      taskRepository.findOne = jest.fn().mockResolvedValue(null);
      expect(taskRepository.findOne).not.toHaveBeenCalled();
      expect(service.updateTaskStatus(mockNewStatus, mockUser)).rejects.toThrow(NotFoundException);
      expect(taskRepository.findOne).toHaveBeenCalledWith({where: {id: mockNewStatus.id, userId: mockUser.id}});
    });

    it('throw error when task not fount', async () => {
      taskRepository.findOne = jest.fn().mockResolvedValue(mockOldStatus);
      expect(taskRepository.findOne).not.toHaveBeenCalled();

      expect(service.updateTaskStatus(mockNewStatus, mockUser)).resolves.toEqual({result: true});
      expect(taskRepository.findOne).toHaveBeenCalledWith({where: {id: mockNewStatus.id, userId: mockUser.id}});
    });

  });

});
