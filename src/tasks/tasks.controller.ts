import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ListTaskDto } from './dto/search-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.model';

@Controller('tasks')
export class TasksController {

    constructor(private taskService : TasksService) {}

    @Get()
    getTasks(
        @Query() listTaskDto : ListTaskDto 
    ) : Task[] {
       return this.taskService.getTasks(listTaskDto);
    }


    @Post()
    @ApiOperation({
        summary: "To update the existing task by id"
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {   
                title: {
                    type: 'string',
                    example: "First Task",
                    description: "Name of the product"
                },
                description: {
                    type: 'string',
                    example: "This is a description",
                    description: "Brand name describe about products from which brand product are belongs"
                }
            }
        }
    })
    createTask(@Body() createTaskDto : CreateTaskDto) : Task {
        return this.taskService.createTask(createTaskDto);
    }

    @Get('/:id')
    getTask(
        @Param('id') id : string

    ) : Task {
        return this.taskService.getTaskById(id);
    }

    @Patch('/:id')
    @ApiOperation({
        summary: "To update the existing task by id"
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {   
                title: {
                    type: 'string',
                    example: "First Task",
                    description: "Name of the product"
                },
                description: {
                    type: 'string',
                    example: "This is a description",
                    description: "Brand name describe about products from which brand product are belongs"
                },
                status: {
                    type: 'string',
                    example: "IN_PROGRESS",
                    description: "Brand name describe about products from which brand product are belongs"
                },

            }
        }
    })
    updateTask(
        @Param('id') id : string,
        @Body() updateTask : UpdateTaskDto
    ) : Task {
        return this.taskService.updateTask(id, updateTask);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id : string) {
        return this.taskService.deleteTask(id);
    }
}
