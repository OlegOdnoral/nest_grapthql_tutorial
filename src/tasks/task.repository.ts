import { Repository, EntityRepository } from "typeorm";
import { Task } from "./entities/task.entity";
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from "./models/task-status.enum";
import { GetTasksFilter } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const {title, description} = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }

    async getTasks(filterDto: GetTasksFilter): Promise<Array<Task>> {
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');
        if(status) {
            query.andWhere('task.status = :status', {status});
        }
        if(search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
        }
        return await query.getMany();
    } 

}