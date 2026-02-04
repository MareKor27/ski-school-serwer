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

    if (!data.success) {
      console.log('reCAPTCHA failed:', data['error-codes']);
      throw new UnauthorizedException('reCAPTCHA failed');
    }

    if (data.action !== action) {
      console.log('Invalid reCAPTCHA action:', data['error-codes']);
      throw new UnauthorizedException('Invalid reCAPTCHA action');
    }

    if (data.score < 0.5) {
      console.log('Low reCAPTCHA score:', data.score);
      throw new UnauthorizedException('Low reCAPTCHA score');
    }
    return true;
  }
}
