import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './models/task.model';

@Injectable()
export class TasksService {
    private tasks: Array<Task> = [];

    getAllTasks(): Array<Task> {
        return this.tasks;
    }

    addNewTask(title: string, description: string): Array<Task> {
        const taskForAdd = this.createTask(title, description);
        this.tasks.push(taskForAdd);
        return this.tasks;
    }

    private createTask(title: string, description: string): Task {
        return {
            id: (this.tasks.length+1).toString(),
            status: TaskStatus.OPEN,
            title,
            description,
        }
    } 
}
