import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEmail, IsNumber, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  phone!: string;

  @IsString()
  @MinLength(6)
  confirmPassword!: string;
}

export class NewsletterDto {
  @IsEmail()
  email!: string;
}

export class OrderCustomerDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  phone!: string;
}

export class OrderItemDto {
  @IsString()
  id!: string;

  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsString()
  price!: string;

  @IsNumber()
  priceValue!: number;

  @IsOptional()
  @IsString()
  imageSrc?: string;

  @IsNumber()
  quantity!: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => OrderCustomerDto)
  customer!: OrderCustomerDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsOptional()
  @IsString()
  note?: string;

  @IsNumber()
  total!: number;
}
