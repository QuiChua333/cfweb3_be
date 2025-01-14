import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class ChatGeminiService {
  constructor(
    private readonly repository: RepositoryService,
  ) {}

  async getMessagesOfUser(userId: string) {
    try {
      const user = await this.repository.user.findOne({
        where: {
          id: userId
        }
      });
      if (!user) {
        throw new BadRequestException('UserId không tồn tại');
      }
      const messages = await this.repository.chatGemini.find({
        where: {
          user: { id: userId },
        },
        order: {
          sentAt: 'ASC',
        },
      });

      const res = messages.map(item => {
        return {
          sentAt: item.sentAt,
          content: item.content,
          isGemini: item.isGemini,
        }
      })
      
      return res;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new HttpException(
        'Failed to fetch messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  async sendMessage(userId: string, message: string): Promise<any> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const user = await this.repository.user.findOne({
      where: {
        id: userId
      }
    });
    if (!user) {
      throw new BadRequestException('UserId không tồn tại');
    }
    // Lưu thông tin message của người dùng vào database
    await this.repository.chatGemini.save({
      user: { id: userId },
      content: message,
      isGemini: false,
      sentAt: new Date(),
    });

    try {
      const customPrompt = `
        Bạn là trợ lý AI thông minh. Hãy trả lời chính xác và ngắn gọn theo các ví dụ sau:

        Người dùng: "Hãy cung cấp thêm thông tin cho tôi về hệ thống GiveFun của bạn?"
        Gemini: "GiveFun là một nền tảng được tạo ra nhằm gây quỹ cộng đồng. Hỗ trợ người dùng có những ý tưởng và dự án mang lại giá trị cho nhiều người trong cộng động nhưng chưa có đủ tài chính để thực hiện và muốn gây quỹ hoặc tìm thêm thành viên để thực hiện dự án trở thành hiện thực."

        Người dùng: Chiến dịch là gì? 
        Gemini: Chiến dịch là các dự án mà được người dùng tạo ra để gây quỹ trên hệ thống nhằm mục đích tạo ra sản phẩm có giá trị cho cộng đồng. Người dùng có thể quyên góp ủng hộ và nhận về những ưu đãi và đặc quyền khi mà chiến dịch kết thúc.

        Người dùng: Người dùng sẽ tham gia đóng góp như thế nào? Quy trình đóng góp như thế nào?
        Gemini: Người dùng có thể tham gia đóng góp bằng cách bấm vào chi tiết chiến dịch và chọn ủng hộ bằng cách thanh toán bằng tiền hoặc thông qua mua đặc quyền và thanh toán thông qua các phương thức được hỗ trợ trên hệ thống như Momo, Stripe, kết nối ví Metamask để thanh toán bằng NFT.

        Người dùng: "Bạn có thể hướng dẫn tôi cách để tạo chiến dịch và phát hành chiến dịch?"
        Gemini: "Để tạo được chiến dịch và bắt đầu gây quỹ trên hệ thống bạn cần làm theo các bước sau: \n
        Bước 1: Đăng ký tài khoản trên hệ thống. \n
        Bước 2: Đăng nhập vào hệ thống và cung cấp thông tin xác minh. Tiến hành gửi yêu cầu xác minh đầy đủ các thông tin trên hệ thống.\n
        Bước 3: Bấm vào Tạo chiến dịch trên phần header của trang web để điền các thông tin của chiến dịch. Sau đó gửi yêu cầu xét duyệt chiến dịch cho Admin.\n
        Bước 4: Nếu được duyệt bạn sẽ tiến hành vào phần chiến dịch của tôi và phát hành nó để bắt đầu gây quỹ. Và sau khi thời gian gây quỹ kết thúc thì nếu thành công thì Admin sẽ giải ngân cho tất cả. Ngược lại nếu bị từ chối thì bạn sẽ nhận được email và chỉnh sửa lại thông tin để gửi yêu cầu xét duyệt lại.\n
        "

        Người dùng: "Làm sao để người dùng có thể tin tưởng và đóng góp tiền cho dự án? Có nguy cơ mạo hiểm và mất tiền khi chiến dịch thất bại không?"
        Gemini: "Bạn cứ yên tâm khi chủ chiến dịch khởi tạo họ phải cam kết thực hiện đúng các quy tắc, điều khoản trên hệ thống. Các giao dịch quyên góp của người dùng khi dự án đang gây quỹ sẽ được chuyển về tài khoản của Admin thay vì tài khoản của chủ chiến dịch và sau khi hết thời gian gây quỹ Admin sẽ giải ngân cho các bên."

        Người dùng: "Làm sao để trở thành thành viên của chiến dịch cùng với chủ sở hữu?"
        Gemini: "Hệ thống có hỗ trợ tính năng này, cho phép thành viên cùng với chủ chiến dịch cùng nhau hợp tác gây quỹ.\n 
        Người dùng muốn trở thành thành viên thì sẽ liên hệ với chủ chiến dịch bằng cách liên hệ thông qua kênh chat trực tuyến và cung cấp thông tin email, để chủ chiến dịch có thể gửi mail mời tham gia làm thành viên. Thành viên cũng sẽ có quyền chỉnh sửa chiến dịch nếu như được chủ chiến dịch cấp quyền."

        Người dùng: "Nếu người dùng nhận thấy chiến dịch hay dự án có những vấn đề vi phạm tiêu chuẩn cộng đồng hay có dấu hiệu không đáng tin cậy thì có thể báo cáo nó không?"
        Gemini: "Hệ thống có hỗ trợ tính năng báo cáo vi phạm chiến dịch. \n 
        Người dùng nếu cảm thấy chiến dịch vi phạm các tiêu chuẩn cộng đồng hay không đáng tin cậy thì có thể bấm vào chiến dịch đó và bấm báo cáo vi phạm.\n
        Tiến hành nhập nội dung text và hình ảnh minh chứng và gửi đến Admin.\n
        Admin sẽ xem xét và có thể cho tạm ngưng chiến dịch hoặc khóa tài khoản của chủ chiến dịch."

        Người dùng: "Hệ thống có kiểm soát được những nội dung không phù hợp với tiêu chuẩn cộng đồng ở những kênh bình luận chiến dịch không? "
        Gemini: "Bạn có thể an tâm về điều này vì hệ thống có thể nhận diện các ngôn từ và bình luận từ người dùng có dấu hiệu vi phạm tiêu chuẩn cộng đồng để hạn chế nhất có thể. Hầu như các nghiệp vụ trên hệ thống đều có thể kiểm soát và phải được thống qua Admin kiểm duyệt chặt chẽ để đảm bảo an toàn và bảo mật cho người dùng khi sử dụng hệ thống."

        Câu hỏi của người dùng: "${message}"
      `;

      const result = await model.generateContent(customPrompt);
      
      const msgGemini = result.response.candidates[0].content.parts[0].text;

      // Lưu thông tin message của Gemini vào database
      const resultGemini = {
        user: { id: userId },
        content: msgGemini,
        isGemini: true,
        sentAt: new Date(),
      }
      const res = await this.repository.chatGemini.save(resultGemini);

      return {
        content: res.content,
        isGemini: true,
        sentAt: res.sentAt,
      };
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to connect to Gemini API',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
