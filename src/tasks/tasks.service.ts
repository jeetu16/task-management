import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { v7 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTaskDto } from './dto/search-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';


@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task)
        private taskRepository : Repository<Task>
    ) {}

    async getTasks(listTaskDto : ListTaskDto) : Promise<Task[]> {
        let { status, search } = listTaskDto;
        let queryBuilder = this.taskRepository.createQueryBuilder('tasks');

        if(status) {
            queryBuilder.andWhere('tasks.status = :status', { status })
        }

        if(search) {
            const queryParam = `%${search.toLowerCase()}%`
            queryBuilder.andWhere('LOWER(tasks.title) LIKE :queryParam', { queryParam })
            .orWhere('LOWER(tasks.description) LIKE :queryParam', { queryParam })
        } 

        const tasks = await queryBuilder.getMany();

        return tasks;
    }

    async createTask(createTaskDto : CreateTaskDto) : Promise<Task> {
        let { title, description } = createTaskDto
        let task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN
        })
        await this.taskRepository.save(task);
        return task
    }

    async getTaskById(id : string) : Promise<Task> {

        const task = await this.taskRepository.findOne({
            where: {id}
        })

        if(!task) {
            throw new NotFoundException("Task Not Found");
        }
        return task;
    }

    async updateTask(id : string, updateTask : UpdateTaskDto) : Promise<Task>{
        let existingTask = await this.getTaskById(id);
        await this.taskRepository.update({id}, {...updateTask})

        let task = await this.getTaskById(id);
        return task;
    }

    async deleteTask(id : string) : Promise<void> {

        const result = await this.taskRepository.delete(id);
        if(result.affected === 0) {
            throw new NotFoundException(`Task with Id '${id}' not found`);
        }
    }
}
