import { TaskStatus } from '../models/task.model';

export class GetTasksFilter {
    status: TaskStatus;
    search: string;
}