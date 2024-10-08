import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from './contact/contact.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs_todos_db'),
    TodoModule,
    ContactModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
