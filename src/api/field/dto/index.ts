export class CreateFieldDto {
    name: string;
    fieldGroupId: string;
  }
  
  export class UpdateFieldDto {
    name?: string;
    fieldGroupId?: string;
  }

  export class AllFieldDto {
    textSearch?: string;
    page?: number;
    idFieldGroup: string
  }