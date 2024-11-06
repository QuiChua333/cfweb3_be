import { Controller } from '@nestjs/common';
import { ReportResponseService } from './report-response.service';
import ReportResponseRoute from './report-response.routes';
import { InjectRoute } from '@/decorators';

@Controller(ReportResponseRoute.root)
export class ReportResponseController {
  constructor(private readonly reportResponseService: ReportResponseService) {}

  @InjectRoute(ReportResponseRoute.findAll)
  findAll() {
    return this.reportResponseService.findAll();
  }
}
