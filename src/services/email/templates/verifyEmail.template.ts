export const verifyEmailTemplate = (url: string) => {
  return `
    <!Doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Xác minh Email</title>
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
              <img src="https://i.ibb.co/CPZBhtp/GForm-logo.png" class="img" />
              <h2>Xác minh email của bạn</h2>
              <p>
                Vui lòng nhấn vào nút bên dưới để xác minh địa chỉ email của bạn.
              </p>
              <p style="text-align: center; margin-top: 30px">
                <a
                  href="${url}"
                  style="
                    cursor: pointer;
                    display: inline-block;
                    background-color: #fcc934;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                  "
                  >Xác minh Email</a
                >
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  
      `;
};
