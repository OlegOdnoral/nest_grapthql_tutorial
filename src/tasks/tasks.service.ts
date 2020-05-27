import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './models/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatus } from './dto/update-status.dto';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from './../auth/entities/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getAllTasks(filterDto: GetTasksFilter, user: User): Promise<Array<Task>> {
        return await this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({where: {id, userId: user.id}});
        if (!found) {
            throw new NotFoundException(`Task with ID = ${id} not found!`);
        }
        return found
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: number, user: User): Promise<{result: boolean}> {
        const queryResult = await this.taskRepository.delete({id, userId: user.id});
        if(queryResult.affected < 1) {
            throw new NotFoundException(`Task with ID = ${id} not found!`);
        }
        return { result: true };
    }

    async updateTaskStatus(updateStatus: UpdateStatus, user: User): Promise<{result: boolean}> {
        const {id, status} = updateStatus;
        const task = await this.getTaskById(id, user);
        if(!task) return { result: false }
        task.status = status;
        task.save();
        return { result: true }
    }

}
