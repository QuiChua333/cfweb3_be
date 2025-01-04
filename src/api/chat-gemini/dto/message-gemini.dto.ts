interface IInlineDataType {
    data: string
    mimeType: string
}
export class MessageChatGeminiDto {
    message?: string;
    image?: IInlineDataType;
}
