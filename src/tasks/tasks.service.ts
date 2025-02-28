import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTaskDto } from './dto/search-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task)
        private taskRepository : Repository<Task>
    ) {}

    async getTasks(listTaskDto : ListTaskDto, user : User) : Promise<Task[]> {
        let { status, search } = listTaskDto;
        let queryBuilder = this.taskRepository.createQueryBuilder('tasks');

        queryBuilder.andWhere('tasks.userId = :userId', { userId: user.id })

        if(status) {
            queryBuilder.andWhere('tasks.status = :status', { status })
        }

        if(search) {
            const queryParam = `%${search.toLowerCase()}%`
            queryBuilder.andWhere('(LOWER(tasks.title) LIKE :queryParam OR LOWER(tasks.description) LIKE :queryParam)', { queryParam })
        }


        const tasks = await queryBuilder.getMany();

        return tasks;
    }

    async createTask(createTaskDto : CreateTaskDto, user: User) : Promise<Task> {
        let { title, description } = createTaskDto
        let task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        })
        await this.taskRepository.save(task);
        return task
    }

    async getTaskById(id: string, user: User) : Promise<Task> {

        const task = await this.taskRepository.findOne({
            where: { id, user }
        })

        if(!task) {
            throw new NotFoundException("Task Not Found");
        }
        return task;
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User) : Promise<Task>{
        let existingTask = await this.getTaskById(id, user);

        let task = {...existingTask, ...updateTaskDto}
        await this.taskRepository.save(task);

        return task;
    }

    async deleteTask(id: string, user: User) : Promise<void> {

        const result = await this.taskRepository.delete({id, user});
        if(result.affected === 0) {
            throw new NotFoundException(`Task with Id '${id}' not found`);
        }
    }
}
