import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PriceObjectEach {
    @IsNotEmpty()
    amount: string;
    @IsNotEmpty()
    rent_billing_mode: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsOptional()
    type: string;
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PriceObjectEach)
    prices?: PriceObjectEach[]
}
