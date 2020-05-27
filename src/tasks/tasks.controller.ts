import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Delete, 
    Patch, 
    Query, 
    UsePipes, 
    ValidationPipe, 
    ParseIntPipe, 
    UseGuards, 
    } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './models/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatus } from './dto/update-status.dto';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from './../auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilter,
        @GetUser() user: User
        ): Promise<Array<Task>> {
            return this.tasksService.getAllTasks(filterDto, user);
        }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) taskId: number,
        @GetUser() user: User
        ): Promise<Task> {
            return this.tasksService.getTaskById(taskId, user);
        }

    @Post()
    @UsePipes(ValidationPipe)
    addNewTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
        ): Promise<Task> {
            return this.tasksService.createTask(createTaskDto, user);
        }

    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) taskId: number,
        @GetUser() user: User,
        ): Promise<{result: boolean}> {
            return this.tasksService.deleteTaskById(taskId, user);
        }


    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
        ): Promise<{result: boolean}> {
            const updateStatus: UpdateStatus = {id, status};
            return this.tasksService.updateTaskStatus(updateStatus, user);
        }

}
