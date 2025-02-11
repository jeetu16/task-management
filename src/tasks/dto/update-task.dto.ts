import { IsEnum, IsOptional } from "class-validator";
import { TaskStatus } from "../task.status.enum";

export class UpdateTaskDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus
    @IsOptional()
    title: string;
    @IsOptional()
    description: string;
}