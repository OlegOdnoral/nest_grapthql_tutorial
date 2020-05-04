import { TaskStatus } from '../models/task.model';
import { IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFilter {

    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsNotEmpty()
    search: string;
}