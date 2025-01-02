interface IFileType {
    fileName: string;
    url: string;
    public_id: string;
}

export class MetadataMessageDto {
    images?: string[];
    files?: IFileType[];
}