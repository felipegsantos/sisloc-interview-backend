import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
        
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    height: string;
    @IsNotEmpty()
    length: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    sku: string;
    @IsNotEmpty()
    user_company_id: string;
    @IsNotEmpty()
    weight: string;
    @IsNotEmpty()
    width: string;
}
