import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Array<Task> = [];

    getAllTasks(): Array<Task> {
        return this.tasks;
    }

    addNewTask(createTaskDto: CreateTaskDto): Array<Task> {
        const taskForAdd = this.createTask(createTaskDto);
        this.tasks.push(taskForAdd);
        return this.tasks;
    }

    private createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        return {
            id: (this.tasks.length+1).toString(),
            status: TaskStatus.OPEN,
            title,
            description,
        }
    } 
}
