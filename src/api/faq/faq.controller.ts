import { Controller } from '@nestjs/common';
import { FaqService } from './faq.service';
import FAQRoute from './faq.routes';
import { InjectRoute } from '@/decorators';

@Controller(FAQRoute.root)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @InjectRoute(FAQRoute.findAll)
  findAll() {
    return this.faqService.findAll();
  }
}
