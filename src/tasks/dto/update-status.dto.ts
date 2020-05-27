import { TaskStatus } from '../models/task-status.enum';

export class UpdateStatus {
    id: number;
    status: TaskStatus;
}