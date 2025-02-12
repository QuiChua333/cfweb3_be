export class CreateFieldGroupDto {
    name: string;
}
  
export class UpdateFieldGroupDto {
    name?: string;
}
  
export class AllFieldGroupDto {
  textSearch?: string;
  page?: number;
}