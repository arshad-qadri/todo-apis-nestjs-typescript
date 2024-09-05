import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from 'src/schemas/contact.schema';
import { MailService } from 'src/services/mail.service';

interface IContact {
  name: string;
  email: string;
  message: string;
}
@Controller('/api')
export class ContactController {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
    private readonly mailService: MailService,
  ) {}

  @Post('/contact')
  @HttpCode(201)
  async contactToUs(@Body() body: IContact) {
    try {
      const newContact = await this.contactModel.create(body);
      await newContact.save();
      await this.mailService.sendOwnerMail(body.name, body.email, body.message);
      await this.mailService.sendUserConfirmationMail(body.email);
      return { message: 'Thanks for contacting, We will contact you asap!' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
