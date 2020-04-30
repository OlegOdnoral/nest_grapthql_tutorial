import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatus } from './dto/update-status.dto';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilter): Array<Task> {
        if(Object.keys(filterDto).length > 0) {
            return this.tasksService.getTasksWithFilter(filterDto);
        }
        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') taskId: string): Task | undefined {
        return this.tasksService.getTaskById(taskId);
    }

    @Post()
    addNewTask(@Body() createTaskDto: CreateTaskDto): Array<Task> {
        return this.tasksService.addNewTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') taskId: string): {result: boolean} {
        return {
            result: this.tasksService.deleteTaskById(taskId)
        };
    }


    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus): {result: boolean} {
        const updateStatus: UpdateStatus = {id, status};
        return {
            result: this.tasksService.updateTaskStatus(updateStatus)
        };
    }

}
