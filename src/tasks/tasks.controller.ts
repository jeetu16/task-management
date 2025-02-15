import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ListTaskDto } from './dto/search-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() listTaskDto: ListTaskDto, @GetUser() user : User): Promise<Task[]> {
    return this.taskService.getTasks(listTaskDto, user);
  }

  @Post()
  @ApiOperation({
    summary: 'To update the existing task by id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'First Task',
          description: 'Name of the product',
        },
        description: {
          type: 'string',
          example: 'This is a description',
          description:
            'Brand name describe about products from which brand product are belongs',
        },
      },
    },
  })
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'To update the existing task by id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'First Task',
          description: 'Name of the product',
        },
        description: {
          type: 'string',
          example: 'This is a description',
          description:
            'Brand name describe about products from which brand product are belongs',
        },
        status: {
          type: 'string',
          example: 'IN_PROGRESS',
          description:
            'Brand name describe about products from which brand product are belongs',
        },
      },
    },
  })
  updateTask(
    @Param('id') id: string,
    @Body() updateTask: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTask);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
