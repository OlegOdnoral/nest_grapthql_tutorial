import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(): Array<Task> {
        return this.tasksService.getAllTasks();
    }

    @Post()
    addNewTask(@Body() createTaskDto: CreateTaskDto): Array<Task> {
        return this.tasksService.addNewTask(createTaskDto);
    }
}
