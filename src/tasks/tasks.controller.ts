import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './models/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatus } from './dto/update-status.dto';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilter): Promise<Array<Task>> {
        return this.tasksService.getAllTasks(filterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) taskId: number): Promise<Task> {
        return this.tasksService.getTaskById(taskId);
    }

    @Post()
    @UsePipes(ValidationPipe)
    addNewTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) taskId: number): Promise<{result: boolean}> {
        return this.tasksService.deleteTaskById(taskId);
    }


    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
        ): Promise<{result: boolean}> {
        const updateStatus: UpdateStatus = {id, status};
        return this.tasksService.updateTaskStatus(updateStatus)
    }

}
