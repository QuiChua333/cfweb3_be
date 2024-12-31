import {
  Body,
  Controller,
  Param,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ContributionService } from './contribution.service';
import ContributionRoute from './contribution.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import {
  ContributionPaginationDto,
  ContributionUserFinishQueryStatus,
  ContributionUserPaginationDto,
  PaymentDto,
  RefundPaginationDto,
  UpdateContributionDto,
  UpdateRefundDto,
} from './dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(ContributionRoute.root)
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @InjectRoute(ContributionRoute.getAllContributionsByCampaign)
  getAllContributionsByCampaign(@Query() contributionPaginationDto: ContributionPaginationDto) {
    return this.contributionService.getAllContributionsByCampaign(contributionPaginationDto);
  }

  @InjectRoute(ContributionRoute.getAllRefundsByCampaign)
  getAllRefundsByCampaign(@Query() refundPaginationDto: RefundPaginationDto) {
    return this.contributionService.getAllRefundsByCampaign(refundPaginationDto);
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

  @InjectRoute(ContributionRoute.editRefundStatus)
  @UseInterceptors(FileInterceptor('file'))
  editRefundStatus(
    @Param('contributionId') contributionId: string,
    @Body() updateRefundDto: UpdateRefundDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.contributionService.editRefundStatus(contributionId, updateRefundDto, file);
  }

  @InjectRoute(ContributionRoute.getQuantityContributionOfUser)
  getQuantityContributionOfUser(@Param('userId') userId: string) {
    return this.contributionService.getQuantityContributionOfUser(userId);
  }

  @InjectRoute(ContributionRoute.getAllContributesOfUser)
  getAllContributesOfUser(
    @User() currentUser: ITokenPayload,
    @Query() contributionUserPaginatioDto: ContributionUserPaginationDto,
  ) {
    return this.contributionService.getAllContributesOfUser(
      currentUser,
      contributionUserPaginatioDto,
    );
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

  @InjectRoute(ContributionRoute.paymentCrypto)
  paymentCrypto(@Body() paymentDto: PaymentDto) {
    return this.contributionService.paymentCrypto(paymentDto);
  }

  @InjectRoute(ContributionRoute.webhookMomo)
  webhookMomo(@Body() momoBody) {
    return this.contributionService.webhookMomo(momoBody);
  }
}
