import { Injectable } from '@nestjs/common';
import { guarantees, testimonials } from '@app/common';

@Injectable()
export class ContentService {
  getGuarantees() {
    return guarantees;
  }

  getTestimonials() {
    return testimonials;
  }

  subscribe(email: string) {
    return {
      message: `Email ${email} успешно добавлен в рассылку`,
    };
  }
}

