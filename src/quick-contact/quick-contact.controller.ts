import { Body, Controller, Post } from '@nestjs/common';
import { QuickContactService } from './quick-contact.service';
import * as nodemailer from 'nodemailer';
import { QuickContactDto } from './dto/quick-contact.dto';

@Controller('quick-contact')
export class QuickContactController {
  constructor(private readonly quickContactService: QuickContactService) {}

  @Post()
  async sendQuickContact(@Body() quickContact: QuickContactDto) {
    // sendEmail(quickContact);
    return { message: 'Formularz został wysłany' };
  }
}

async function sendEmail(quickContact: QuickContactDto) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const htmlContent = `<h1>Wiadomość z szybkiego kontaktu</h1>
  <p><b>Imię i nazwisko:</b> ${quickContact.fullName}</p>
  <p><b>Email:</b> ${quickContact.email}</p>
  <p><b>Telefon:</b> <a href="tel:${quickContact.phone}">${quickContact.phone}</a></p>
  <p><b>Tytuł:</b> ${quickContact.subject}</p>
  <p><b>Wiadomość:</b> ${quickContact.message}</p>`;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: 'marek.korzeniewski1996@gmail.com',
    subject: `FigowskiSport - Nowe zapytanie od ${quickContact.fullName}`,
    html: htmlContent,
  });
}
