import { Contribution } from '@/entities';
import { formatDate } from '@/utils';

const contributionSuccessHasPerksTemplate = (contribution: Contribution) => {
  const perks = JSON.parse(contribution.perks as string);
  const shippingInfo = JSON.parse(contribution.shippingInfo as string);
  const dateString = formatDate(new Date(shippingInfo.estDeliveryDate));
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template Email</title>
    <style>
      *{ 
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        box-sizing: border-box;
       }
       .container {
        display: flex;
        flex-direction: column;
        align-items: center;
       }
      .header {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin: 20px 0 0;
        color: #007b50;
        font-weight: bold;
        font-size: 30px;
        h2 {
          text-decoration: underline;
        }
        img {
          width: 350px;
          height: 300px;
        }
      }
      .body {
        display: flex;
        flex-direction: column;
        margin: 0 0 20px;
        padding: 20px;
        border: 4px solid #34CA96;
      }
      .footer {
        margin: 0 0 40px;
      }
      .body3 {
        text-align: center;
      }
    </style>
  
  </head>
  
  <body>
    <div class="container">
      <div class="header">
        <h1>THÔNG TIN ĐÓNG GÓP</h1>
        <img style="width: 140px; height: 100px;" src="https://i.pinimg.com/originals/0c/e3/67/0ce3678db6f4abe43408ad7b1e988a4b.gif" alt="i">
      </div>
      <div class="body">
        <div>
          <div style="margin: 8px 0;">
            <span>Chiến dịch: </span>
            <span style="font-weight: bold; text-transform: uppercase;">${contribution.campaign.title}</span>
          </div>
          <div style="margin: 8px 0;">
            <span>Số tiền đóng góp: </span>
            <span style="font-weight: bold; text-transform: uppercase;">${contribution.amount}</span>
          </div>
        </div>
        <div style="height: 2px; background-color: #007b50; width: 100%; margin: 14px 0;"></div>
        <div class="">
          <span style="font-size: 16px; font-weight: bold;">Danh sách đặc quyền bao gồm: </span>
  
          ${perks
            .map((perk) => {
              return `<div style="margin-left: 20px; margin-top: 10px;">
              <b style="font-style: italic;">${perk.name} x ${perk.quantity}</b>
              <ul style="margin-left: 40px;">
                  ${perk.options
                    .map((i) => {
                      return `<li>${i.quantity} ${i.name}: ${i.optionsString}</li>`;
                    })
                    .join('')}
              </ul>
            </div>`;
            })
            .join('')}
  
          
          
        </div>
        <div style="height: 2px; background-color: #007b50; width: 100%; margin: 14px 0;"></div>
        <div class="body3">
          <span style="margin: 10px 0 30px; font-weight: bold; font-style: italic; text-decoration: underline;">THÔNG TIN GIAO NHẬN</span>
          <div style="margin: 20px 0 8px;">
            <span>Họ tên người nhận: </span>
            <span style="font-weight: bold;">${shippingInfo.fullName}</span>
          </div>
          <div style="margin: 8px 0;">
            <span>Điah chỉ nhận: </span>
            <span style="font-weight: bold;">${shippingInfo.detail}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.province}</span>
          </div>
          <div style="margin: 8px 0;">
            <span>Số điện thoại: </span>
            <span style="font-weight: bold;">${shippingInfo.phoneNumber}</span>
          </div>
          <div style="margin: 8px 0;">
            <span>Ngày dự kiến nhận: </span>
            <span style="font-weight: bold;">${dateString}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <span style="color: #34CA96; font-weight: bold; font-size: 20px;">GiveFun cảm ơn bạn đã ủng hộ chiến dịch</span>
      </div>
    </div>
  </body>
  </html>`;
};

export default contributionSuccessHasPerksTemplate;
