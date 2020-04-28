import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(): Array<Task> {
        return this.tasksService.getAllTasks();
    }

    @Post()
    addNewTask(
        @Body('title') title: string, 
        @Body('description') description: string
        ): Array<Task> {
        return this.tasksService.addNewTask(title, description);
    }
}
