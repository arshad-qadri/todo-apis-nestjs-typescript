import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from 'src/schemas/contact.schema';
import { ContactController } from './contact.controller';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [ContactController],
  providers:[MailService]
})
export class ContactModule {}
