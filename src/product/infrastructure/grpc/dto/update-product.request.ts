import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateProductDto } from '../../../application/dto/update-product.dto';

export class UpdateProductRequest extends UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
