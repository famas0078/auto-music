import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PATTERNS } from '@app/common';
import { ContentService } from './app.service';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @MessagePattern(PATTERNS.content.guarantees)
  getGuarantees() {
    return this.contentService.getGuarantees();
  }

  @MessagePattern(PATTERNS.content.testimonials)
  getTestimonials() {
    return this.contentService.getTestimonials();
  }

  @MessagePattern(PATTERNS.content.newsletter)
  subscribe(@Payload() payload: { email: string }) {
    return this.contentService.subscribe(payload.email);
  }
}

