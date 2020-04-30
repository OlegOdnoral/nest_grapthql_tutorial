import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatus } from './dto/update-status.dto';

@Injectable()
export class TasksService {
    private tasks: Array<Task> = [];

    getAllTasks(): Array<Task> {
        return this.tasks;
    }

    getTaskById(taskId: string): Task | undefined {
        return this.tasks.find((item: Task) => item.id === taskId);
    }

    addNewTask(createTaskDto: CreateTaskDto): Array<Task> {
        const taskForAdd = this.createTask(createTaskDto);
        this.tasks.push(taskForAdd);
        return this.tasks;
    }

    private createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        return {
            id: (this.tasks.length+1).toString(),
            status: TaskStatus.OPEN,
            title,
            description,
        }
    } 

    deleteTaskById(taskId: string): boolean {
        const itemIndex = this.tasks.findIndex((item: Task) => item.id === taskId);
        if(itemIndex < 0) return false;
        this.tasks.splice(itemIndex, 1);
        return true;
    }

    updateTaskStatus(updateStatus: UpdateStatus): boolean {
        const result = this.tasks.find((item: Task, index: number) => {
            if(item.id = updateStatus.id) {
                this.tasks[index].status = updateStatus.status;
                return item;
            }
            return undefined;
        });
        return result ? true : false;
    }

}
