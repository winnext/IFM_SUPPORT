import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { FacilityUserRoles } from 'src/common/const/keycloak.role.enum';
import { ClassificationService } from './classification.service';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { PreClassificationService } from './pre-classification.service';

@ApiTags('PreClassification')
@ApiBearerAuth('JWT-auth')
@Controller('pre-classification')
export class PreClassificationController {
  constructor(private readonly preClassificationService: PreClassificationService, 
              private readonly classificationService: ClassificationService) {}

  @Get()
  @Unprotected()
  findAll(@Query() paramDto: PaginationParams) {
    return this.preClassificationService.findAll(paramDto);
  }

  //Roles({ roles: [FacilityUserRoles.ADMIN] })
  @Unprotected()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        dt: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('createclassifications')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './upload' }),
    }),
  )
  async createClasificationsByCsv(@Body() dt, @Res() res, @UploadedFile() file: Express.Multer.File) {
    let result = await this.preClassificationService.createAll(file);
    var o = await this.preClassificationService.findAll({"page":0,"limit":1000,"orderBy":"ascending", "orderByColumn":"code"}); 
    await this.classificationService.createAll(o[0][0],dt.dt);
    await this.preClassificationService.dropCollection();
    return res.send(result);  
    }
}
