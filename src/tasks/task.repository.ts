import { Repository, EntityRepository } from "typeorm";
import { Task } from "./entities/task.entity";
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from "./models/task-status.enum";
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
import { User } from './../auth/entities/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const {title, description} = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();

        delete task.user;
        return task;
    }

    async getTasks(filterDto: GetTasksFilter, user: User): Promise<Array<Task>> {
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId',  {userId: user.id})
        if(status) {
            query.andWhere('task.status = :status', {status});
        }
        if(search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
        }
        return await query.getMany();
    } 

}