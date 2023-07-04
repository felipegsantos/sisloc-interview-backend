import * as path from 'node:path';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: 'medias/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
      }
    })
  }))
  async uploadPhoto(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 100000 }),
      new FileTypeValidator({ fileType: 'image/*' }),
    ],
  })) file: Express.Multer.File, @Body() productData: any) {
    return await this.productService.uploadPhoto(productData.id, file);
  }

  @Public()
  @Get('/medias/view/:media_key')
  async viewMedia(@Param('media_key') media_key: string, @Res() response: Response) {
    const mediapath = Buffer.from(media_key, 'hex').toString('utf8');
    const mediaData = await this.productService.viewMedia(mediapath);

    const filepath = mediaData.path_src.split('/');

    response.sendFile(filepath.pop(), { root: filepath[filepath.length - 1] });
  }

  @Get('/medias/:model_id')
  async findMedias(@Param('model_id') model_id: string) {
    return await this.productService.getMedias(model_id);
  }

  @Get()
  async findAll(@Req() request: Request) {
    return await this.productService.findAll(request.user?.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
