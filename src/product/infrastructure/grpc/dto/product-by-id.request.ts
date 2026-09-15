import { IsNotEmpty, IsString } from 'class-validator';

export class ProductByIdRequest {
  @IsString()
  @IsNotEmpty()
  id: string;
}
