import { ApiPropertyOptional } from "@nestjs/swagger";
import { TaskStatus } from "../task.status.enum";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ListTaskDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search: string;

    @ApiPropertyOptional({
        enum: TaskStatus,
        example: TaskStatus.IN_PROGRESS
    })
    @IsEnum(TaskStatus)
    @IsOptional()
    status : TaskStatus; 
}