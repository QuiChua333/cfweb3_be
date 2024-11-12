const fundingTemplate = ({ campaignTitle }: { campaignTitle: string }) => {
  return `
   <!Doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ĐĂNG TẢI THÀNH CÔNG</title>
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
          <h2>Thông báo đăng tải chiến dịch</h2>
         
          <p>Chiến dịch ${campaignTitle} đã được phê duyệt và đăng tải thành công trên hệ thống</p>

          
        </td>
      </tr>
    </table>
  </body>
</html>

      `;
};

export default fundingTemplate;
