import { TaskStatus } from '../models/task-status.enum';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetTasksFilter {

    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}