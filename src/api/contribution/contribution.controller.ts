import { Body, Controller, Param, Query, Req, Res } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import ContributionRoute from './contribution.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { ContributionPaginationDto, PaymentDto, UpdateContributionDto } from './dto';
import { Request } from 'express';

@Controller(ContributionRoute.root)
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @InjectRoute(ContributionRoute.getAllContributionsByCampaign)
  getAllContributionsByCampaign(@Query() contributionPaginationDto: ContributionPaginationDto) {
    return this.contributionService.getAllContributionsByCampaign(contributionPaginationDto);
  }

  @InjectRoute(ContributionRoute.getTopContributionsByCampaign)
  getTopContributionsByCampaign(
    @User() currenUser: ITokenPayload,
    @Param('campaignId') campaignId: string,
  ) {
    return this.contributionService.getTopContributionsByCampaign(currenUser, campaignId);
  }

  @InjectRoute(ContributionRoute.getTotalMoneyByCampaign)
  getTotalMoneyByCampaign(@Param('campaignId') campaignId: string) {
    return this.contributionService.getTotalMoneyByCampaign(campaignId);
  }

  @InjectRoute(ContributionRoute.getQuantityPeopleByCampaign)
  getQuantityPeopleByCampaign(@Param('campaignId') campaignId: string) {
    return this.contributionService.getQuantityPeopleByCampaign(campaignId);
  }

  @InjectRoute(ContributionRoute.editStatus)
  editStatus(
    @Param('contributionId') contributionId: string,
    @Body() updateContributionDto: UpdateContributionDto,
  ) {
    return this.contributionService.editStatus(contributionId, updateContributionDto);
  }

  @InjectRoute(ContributionRoute.getQuantityContributionOfUser)
  getQuantityContributionOfUser(@User() currenUser: ITokenPayload) {
    return this.contributionService.getQuantityContributionOfUser(currenUser);
  }

  @InjectRoute(ContributionRoute.paymentStripe)
  paymentStripe(@Body() paymentDto: PaymentDto) {
    return this.contributionService.paymentStripe(paymentDto);
  }

  @InjectRoute(ContributionRoute.webhookStripe)
  webhookStripe(@Req() req: Request) {
    return this.contributionService.webhookStripe(req);
  }

  @InjectRoute(ContributionRoute.paymentMomo)
  paymentMomo(@Body() paymentDto: PaymentDto) {
    return this.contributionService.paymentMomo(paymentDto);
  }

  @InjectRoute(ContributionRoute.webhookMomo)
  webhookMomo(@Body() momoBody) {
    return this.contributionService.webhookMomo(momoBody);
  }
}
