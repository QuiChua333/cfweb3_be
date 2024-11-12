import { ISendInvitationEmail } from '../email.interface';

const invitationTeamTemplate = ({
  campaignTitle,
  linkEditCampaign,
  ownerName,
}: {
  campaignTitle: string;
  linkEditCampaign: string;
  ownerName: string;
}) => {
  return `
   <!Doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tham gia chiến dịch</title>
  </head>
  <style>
    body {
      color: #5f6368;
      background-color: #f9f9f9;
    }
    .img {
      border-radius: 20px;
      width: 200px;
    }
  </style>
  <body style="font-family: Arial, sans-serif">
    <table
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border-collapse: collapse;
      "
    >
      <tr>
        <td style="background-color: #ffffff; padding: 30px">
          <img src="https://res.cloudinary.com/dlotmnagu/image/upload/v1731468220/logo-email_ppjv2y.png" class="img" />
          <h2>Tham gia chiến dịch: ${campaignTitle}</h2>
         
          <p>Nhấn vào nút bên dưới để tham gia vào chiến dịch của ${ownerName}</p>
          <p style="text-align: center; margin-top: 30px">
            <a
              href="${linkEditCampaign}"
              style="
                cursor: pointer;
                display: inline-block;
                background-color: #34CA96;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
              "
              >Truy cập</a
            >
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

      `;
};

export default invitationTeamTemplate;