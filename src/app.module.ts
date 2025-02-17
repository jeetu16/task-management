import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Logger as TypeOrmLogger } from 'typeorm';
import { Logger } from '@nestjs/common'

export class DBLogger implements TypeOrmLogger {
  private readonly logger = new Logger(DBLogger.name);

  logQuery(query: string, parameters?: any[]) {
    this.logger.log(`Query: ${query} - Parameters: ${JSON.stringify(parameters)}`);
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.logger.error(`Query Error: ${error} - Query: ${query} - Parameters: ${JSON.stringify(parameters)}`);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(`Slow Query (${time}ms): ${query} - Parameters: ${JSON.stringify(parameters)}`);
  }

  logSchemaBuild(message: string) {
    this.logger.log(`Schema Build: ${message}`);
  }

  logMigration(message: string) {
    this.logger.log(`Migration: ${message}`);
  }

  log(level: "log" | "info" | "warn", message: any) {
    if (level === "log" || level === "info") {
      this.logger.log(message);
    } else if (level === "warn") {
      this.logger.warn(message);
    }
  }
}


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "root",
      database: "task-management",
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      logger: new DBLogger()
    }),
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}

