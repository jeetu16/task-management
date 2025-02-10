import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { v7 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTaskDto } from './dto/search-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.model';


@Injectable()
export class TasksService {

    private tasks: Task[] = [];

    getTasks(listTaskDto : ListTaskDto) : Task[] {
        let { status, search } = listTaskDto;
        let tasks = this.tasks;

        if(status) {
             tasks = tasks.filter(task => task.status === status)
        }

        if(search) {
            tasks = tasks.filter(task => {
                if(task.title.includes(search) || task.description.includes(search)) {
                    return true
                }
                return false
            })
        } 

        return tasks;
    }

    createTask(createTaskDto : CreateTaskDto) : Task {
        let { title, description } = createTaskDto
        const task : Task = {
            id : uuid(),
            title,
            description,
            status : TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task
    }

    getTaskById(id : string) : Task {
        const task = this.tasks.find(task => task.id === id)
        if(!task) {
            throw new NotFoundException("Task Not Found");
        }
        return task;
    }

    updateTask(id : string, updateTask : UpdateTaskDto) : Task{
        let existingTask = this.getTaskById(id);
        const task = {
            id,
            ...existingTask,
            ...updateTask
        }

        let tasks = this.tasks.filter(task => task.id !== id)
        this.tasks = [...tasks, task];

        return task;
    }

    deleteTask(id : string) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}
