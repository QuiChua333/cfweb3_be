import { Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignService } from '../campaign/campaign.service';
import {
  ContributionFinishQueryStatus,
  ContributionPaginationDto,
  ContributionSortContributionDateQueryStatus,
  ContributionSortMoneyQueryStatus,
  ContributionUserFinishQueryStatus,
  ContributionUserPaginationDto,
  PaymentDto,
  PerkPaymentDto,
  UpdateContributionDto,
} from './dto';
import Stripe from 'stripe';
import { envs } from '@/config';
import { PaymentMethod, PaymentStatus } from '@/constants';
import { Request } from 'express';
import { IPayloadStripeSuccess } from './contribution.interface';
import axios from 'axios';
import { EmailService } from '@/services/email/email.service';
@Injectable()
export class ContributionService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly campaignService: CampaignService,
    private readonly emailService: EmailService,
  ) {}
  private readonly stripe = new Stripe(envs.stripe.apiKeySecret);

  async getAllContributionsByCampaign(contributionPaginationDto: ContributionPaginationDto) {
    const {
      page = 1,
      limit = 10,
      searchString,
      sortContributionDate,
      sortMoney,
      status,
      campaignId,
    } = contributionPaginationDto;
    const query = this.repository.contribution
      .createQueryBuilder('contribution')
      .leftJoinAndSelect('contribution.campaign', 'campaign')
      .leftJoinAndSelect('contribution.user', 'user')
      .where('campaign.id = :campaignId', { campaignId });

    if (searchString && searchString.trim() !== '') {
      if ('khách vãng lai'.includes(searchString.trim().toLowerCase())) {
        query.andWhere("user.fullName IS NULL OR user.fullName = ''");
      } else {
        // Tìm kiếm theo email hoặc fullName
        query.andWhere(
          '(contribution.email ILIKE :searchString OR user.fullName ILIKE :searchString)',
          { searchString: `%${searchString}%` },
        );
      }
    }

    // Sorting (based on different fields if provided)
    if (
      sortContributionDate &&
      sortContributionDate !== ContributionSortContributionDateQueryStatus.ALL
    ) {
      query.addOrderBy(
        'contribution.date',
        sortContributionDate === ContributionSortContributionDateQueryStatus.Nearest
          ? 'DESC'
          : 'ASC',
      );
    }

    if (sortMoney && sortMoney !== ContributionSortMoneyQueryStatus.ALL) {
      query.addOrderBy(
        'contribution.amount',
        sortMoney === ContributionSortMoneyQueryStatus.ASC ? 'ASC' : 'DESC',
      );
    }

    // Filter by status if provided
    if (status && status !== ContributionFinishQueryStatus.ALL) {
      query.andWhere('contribution.isFinish = :status', {
        status: status === ContributionFinishQueryStatus.FINISH,
      });
    }

    query.skip((page - 1) * limit).take(limit);

    const [contributions, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      contributions: contributions.map((contribution) => ({
        id: contribution.id,
        email: contribution.email,
        fullName: contribution.user?.fullName || null,
        isFinish: contribution.isFinish,
        amount: contribution.amount,
        totalPayment: contribution.totalPayment,
        method: contribution.method,
        amountCrypto: contribution.amountCrypto,
        transactionHash: contribution.transactionHash,
        customerWalletAddress: contribution.customerWalletAddress,
        date: contribution.date,
        bankName: contribution.bankName,
        bankAccountNumber: contribution.bankAccountNumber,
        bankUsername: contribution.bankUsername,
        perks: JSON.parse(contribution.perks as string),
        shippingInfo: JSON.parse(contribution.shippingInfo as string),
        estDeliveryDate: JSON.parse(contribution.shippingInfo as string).estDeliveryDate,
      })),
      totalPages,
      page,
      limit,
    };
  }
  async getAllContributesOfUser(
    currentUser: ITokenPayload,
    contributionUserPaginatioDto: ContributionUserPaginationDto,
  ) {
    const {
      page = 1,
      limit = 10,
      searchString,
      status,
      sortContributionDate,
    } = contributionUserPaginatioDto;

    const query = this.repository.contribution
      .createQueryBuilder('contribution')
      .leftJoinAndSelect('contribution.campaign', 'campaign')
      .leftJoinAndSelect('contribution.user', 'user')
      .where('user.id = :userId', { userId: currentUser.id });

    if (searchString && searchString.trim() !== '') {
      query.andWhere('(campaign.title ILIKE :searchString)', { searchString: `%${searchString}%` });
    }

    // Sorting (based on different fields if provided)
    if (
      sortContributionDate &&
      sortContributionDate !== ContributionSortContributionDateQueryStatus.ALL
    ) {
      query.addOrderBy(
        'contribution.date',
        sortContributionDate === ContributionSortContributionDateQueryStatus.Nearest
          ? 'DESC'
          : 'ASC',
      );
    }

    if (status && status !== ContributionUserFinishQueryStatus.ALL) {
      query.andWhere('contribution.isFinish = :status', {
        status: status === ContributionUserFinishQueryStatus.FINISH,
      });
    }

    const [contributions, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      contributions: contributions.map((contribution) => ({
        id: contribution.id,
        email: contribution.email,
        fullName: contribution.user?.fullName || null,
        isFinish: contribution.isFinish,
        amount: contribution.amount,
        totalPayment: contribution.totalPayment,
        date: contribution.date,
        method: contribution.method,
        amountCrypto: contribution.amountCrypto,
        bankName: contribution.bankName,
        bankAccountNumber: contribution.bankAccountNumber,
        transactionHash: contribution.transactionHash,
        customerWalletAddress: contribution.customerWalletAddress,
        bankUsername: contribution.bankUsername,
        campaignTitle: contribution.campaign.title,
        campaignId: contribution.campaign.id,
        perks: JSON.parse(contribution.perks as string),
        shippingInfo: JSON.parse(contribution.shippingInfo as string),
        estDeliveryDate: JSON.parse(contribution.shippingInfo as string).estDeliveryDate,
      })),
      totalPages,
      page,
      limit,
    };
  }
  async getTopContributionsByCampaign(currenUser: ITokenPayload, campaignId: string) {
    const campaign = await this.campaignService.checkOwner(campaignId, currenUser);

    const res = await this.repository.contribution
      .createQueryBuilder('contribution')
      .leftJoinAndSelect('contribution.user', 'user')
      .select([
        'contribution.email as email', // Chọn email từ contribution để nhóm
        'user.fullName as fullName',
        'user.avatar as avatar',
        'user.phoneNumber as phonenumber',
        'user.id as userid',
      ])
      .addSelect('SUM(contribution.amount)', 'totalAmount')
      .addSelect('COUNT(contribution.id)', 'contributionCount')

      .where('contribution.campaign.id = :campaignId', { campaignId })
      .groupBy('contribution.email')
      .addGroupBy('user.fullName')
      .addGroupBy('user.avatar')
      .addGroupBy('user.phoneNumber')
      .addGroupBy('user.id')
      .orderBy('"totalAmount"', 'DESC')
      .limit(10)
      .getRawMany();

    return res.map((item) => ({
      totalAmount: item.totalAmount,
      contributionCount: item.contributionCount,
      email: item.email,
      phoneNumber: item.phonenumber,
      avatar: item.avatar,
      fullName: item.fullname,
      userId: item.userid,
    }));
  }

  async getTotalMoneyByCampaign(campaignId: string) {
    const result = await this.repository.contribution
      .createQueryBuilder('contribution')
      .select('SUM(contribution.amount)', 'totalAmount')
      .where('contribution.campaign.id = :campaignId', { campaignId })
      .andWhere('contribution.status = :status', {
        status: PaymentStatus.SUCCESS,
      })
      .getRawOne();

    return Number(result.totalAmount) || 0;
  }

  async getQuantityPeopleByCampaign(campaignId: string) {
    const [_, count] = await this.repository.contribution.findAndCount({
      where: {
        campaign: {
          id: campaignId,
        },
      },
    });
    return count;
  }

  async editStatus(contributionId: string, updateContributionDto: UpdateContributionDto) {
    const contribution = await this.repository.contribution.findOneBy({ id: contributionId });
    contribution.isFinish = updateContributionDto.isFinish;
    return await this.repository.contribution.save(contribution);
  }

  async getQuantityContributionOfUser(userId: string) {
    const [_, count] = await this.repository.contribution.findAndCount({
      where: {
        user: {
          id: userId,
        },
        status: PaymentStatus.SUCCESS,
      },
    });
    return count;
  }

  async paymentStripe(paymentDto: PaymentDto) {
    const { perks, shippingFee, money } = paymentDto;
    const contribution = await this.createNewContribution(paymentDto, PaymentMethod.STRIPE);
    const session = await this.createPaymentStripeSession(
      money,
      perks,
      shippingFee,
      contribution.id,
    );
    return session;
  }

  async webhookStripe(req: Request) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;
    const endpointSecret = envs.stripe.endpointSecret;

    event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);

    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        const payload = {
          stripePaymentId: chargeSucceeded.id,
          contributionId: chargeSucceeded.metadata.contributionId,
          receiptUrl: chargeSucceeded.receipt_url,
        };
        await this.updateContributionPaymentSuccess(payload);
        this.sendMailContributionSuccess(payload.contributionId);
        break;
      default:
        console.log(`Event ${event.type} not handled`);
    }
    return { sig };
  }

  async paymentMomo(paymentDto: PaymentDto) {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    const { money } = paymentDto;
    const contribution = await this.createNewContribution(paymentDto, PaymentMethod.MOMO);

    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'Thanh toán đặc quyền';
    var partnerCode = 'MOMO';
    var redirectUrl = envs.fe.paymentSuccessUrl;
    var ipnUrl = envs.momo.hookdeckUrl;
    var requestType = 'payWithMethod';
    var amount = `${money}`;
    var orderId = contribution.id;
    var requestId = contribution.id;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    const option = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    const result = await axios(option);
    return result.data;
  }

  async paymentCrypto(paymentDto: PaymentDto) {
    const contribution = await this.createNewContribution(paymentDto, PaymentMethod.CRYPTO);
    this.sendMailContributionSuccess(contribution.id);
    return contribution.id;
  }

  async webhookMomo(momoBody) {
    const contributionId = momoBody['orderId'];
    await this.updateContributionPaymentSuccess({ contributionId });
    this.sendMailContributionSuccess(contributionId);
    return true;
  }

  private async createNewContribution(paymentDto: PaymentDto, method: PaymentMethod) {
    console.log(paymentDto);
    const {
      perks,
      bankAccountNumber,
      bankName,
      bankUsername,
      campaignId,
      shippingInfo,
      money,
      email,
      userId,
      shippingFee,
      amountCrypto,
      customerWalletAddress,
      transactionHash,
    } = paymentDto;
    // foreach perk
    // transactionHash
    // nftAddress
    const contributionInstance = this.repository.contribution.create({
      campaign: {
        id: campaignId,
      },
      amount: money - shippingFee,
      totalPayment: money,
      bankAccountNumber,
      bankName,
      bankUsername,
      email,
      amountCrypto,
      customerWalletAddress,
      transactionHash,
      isFinish: false,
      method: method,
      shippingInfo: JSON.stringify(shippingInfo),
      perks: JSON.stringify(perks),
      status: method === PaymentMethod.CRYPTO ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
      ...(userId
        ? {
            user: {
              id: userId,
            },
          }
        : {}),
      date: new Date(),
    });

    const contribution = await this.repository.contribution.save(contributionInstance);
    return contribution;
  }

  private async createPaymentStripeSession(
    money: number,
    perks: PerkPaymentDto[],
    shippingFee: number,
    contributionId: string,
  ) {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      perks?.map((perk) => {
        return {
          price_data: {
            currency: 'VND',
            product_data: {
              name: perk.name,
              images: [perk.image],
              description: perk.options
                .map((option) => {
                  return `${option.quantity} ${option.name}${option.optionsString && ': '} ${option.optionsString}`;
                })
                .join(';  '),
            },
            unit_amount: perk.price,
          },
          quantity: perk.quantity,
        };
      }) || [];

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          contributionId,
        },
      },
      line_items:
        lineItems.length > 0
          ? lineItems
          : [
              {
                price_data: {
                  currency: 'VND',
                  product_data: {
                    name: 'Money',
                  },
                  unit_amount: money,
                },
                quantity: 1,
              },
            ],
      mode: 'payment',
      ...(lineItems?.length > 0
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: {
                    amount: shippingFee, // số tiền phí ship (50,000 VND trong ví dụ này)
                    currency: 'VND',
                  },
                  display_name: 'Shipping fee',
                },
              },
            ],
          }
        : {}),
      success_url: envs.fe.paymentSuccessUrl,
      cancel_url: envs.fe.paymentCancelUrl,
    });

    return {
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
      url: session.url,
    };
  }

  private async updateContributionPaymentSuccess(payload: IPayloadStripeSuccess) {
    const { contributionId, receiptUrl, stripePaymentId } = payload;
    await this.repository.contribution.save({
      id: contributionId,
      date: new Date(),
      receiptUrl,
      stripePaymentId,
      status: PaymentStatus.SUCCESS,
    });
  }

  private async sendMailContributionSuccess(contributionId: string) {
    const contribution = await this.repository.contribution.findOne({
      where: {
        id: contributionId,
      },
      relations: {
        campaign: true,
      },
      select: {
        campaign: {
          title: true,
        },
      },
    });
    if (contribution.perks) {
      await this.emailService.sendContributionSuccessHasPerk(contribution);
    } else {
      await this.emailService.sendContributionSuccessNoPerk(contribution);
    }
  }
}
