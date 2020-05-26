import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './models/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatus } from './dto/update-status.dto';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getAllTasks(filterDto: GetTasksFilter): Promise<Array<Task>> {
        return await this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id)
        if (!found) {
            throw new NotFoundException(`Task with ID = ${id} not found!`);
        }
        return found
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTaskById(id: number): Promise<{result: boolean}> {
        const queryResult = await this.taskRepository.delete(id);
        return { result: !!queryResult.affected };
    }

    async updateTaskStatus(updateStatus: UpdateStatus): Promise<{result: boolean}> {
        const {id, status} = updateStatus;
        const queryResult = await this.taskRepository.update(id, {status});
        return { result: !!queryResult.affected };
         
    }

}
