// recaptcha.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  private secret = process.env.RECAPTCHA_SECRET_KEY;

  async verifyToken(token: string, action: string) {
    const url = `https://www.google.com/recaptcha/api/siteverify`;
    const params = new URLSearchParams();
    params.append('secret', this.secret!);
    params.append('response', token);

    const response = await axios.post(url, params);

    const data = response.data;
    // Sprawdzenie minimalnego score i zgodności akcji
    if (!data.success || data.score < 0.5 || data.action !== action) {
      throw new UnauthorizedException('Nieprawidłowa reCAPTCHA');
    }
    return true;
  }
}
