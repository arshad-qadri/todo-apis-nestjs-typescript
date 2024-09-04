import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    NotFoundException,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Todo, TodoDocument } from 'src/schemas/todo.schema';
  
  interface IBody {
    todo: string;
    description: string;
    isCompleted?: boolean;
  }
  
  @Controller('/api')
  export class TodoController {
    constructor(
      @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
    ) {}
  
    @Get('/all-todos')
    async getTodos() {
      const todos = await this.todoModel.find().exec();
      if (todos.length > 0) {
        return { todos };
      } else {
        return { message: 'No todos found!' };
      }
    }
  
    @Post('/create-todo')
    @HttpCode(201)
    async createTodo(@Body() body: IBody) {
      try {
        const newTodo = new this.todoModel(body);
        await newTodo.save();
        return { message: 'Todo created successfully!' };
      } catch (error) {
        throw new BadRequestException('Failed to create todo');
      }
    }
  
    @Put('/update-todo/:id')
    async updateTodo(@Body() body: IBody, @Param('id') id: string) {
      try {
        const updatedTodo = await this.todoModel
          .findByIdAndUpdate(id, body, { new: true })
          .exec();
  
        if (!updatedTodo) {
          throw new NotFoundException('Todo not found');
        }
        if (!body.todo && !body.description) {
          throw new BadRequestException('Provide at least one field to update');
        }
        return { message: 'Todo updated successfully!' };
      } catch (error) {
        if (error instanceof BadRequestException || error instanceof NotFoundException) {
          throw error;
        } else {
          throw new HttpException('Internal server error', 500);
        }
      }
    }
  
    @Put('/update-todo-status/:id')
    async updateTodoStatus(@Param('id') id: string, @Body() body: { isCompleted: boolean }) {
      try {
        if (typeof body.isCompleted !== 'boolean') {
          throw new BadRequestException('Invalid value for "isCompleted"');
        }
  
        const updatedTodo = await this.todoModel
          .findByIdAndUpdate(
            id,
            { isCompleted: body.isCompleted },
            { new: true }
          )
          .exec();
  
        if (!updatedTodo) {
          throw new NotFoundException('Todo not found');
        }
  
        return { message: 'Todo status updated successfully!' };
      } catch (error) {
        if (error instanceof BadRequestException || error instanceof NotFoundException) {
          throw error;
        } else {
          throw new HttpException('Internal server error', 500);
        }
      }
    }
  
    @Delete('/delete-todo/:id')
    @HttpCode(200)
    async deleteTodo(@Param('id') id: string) {
      try {
        const deleteResult = await this.todoModel.findByIdAndDelete(id).exec();
  
        if (!deleteResult) {
          throw new NotFoundException('Todo not found');
        }
  
        return { message: 'Todo deleted successfully!' };
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        } else {
          throw new HttpException('Internal server error', 500);
        }
      }
    }
  }
  