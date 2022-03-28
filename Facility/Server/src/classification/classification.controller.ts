import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, Res, UploadedFile } from '@nestjs/common';
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


@ApiTags('Classification')
@ApiBearerAuth('JWT-auth')
@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService,
    private readonly preClassificationService: PreClassificationService ) {}

  @Post()
  @Roles({ roles: [FacilityUserRoles.ADMIN] })
  create(@Body() createClassificationDto: CreateClassificationDto) {
    return this.classificationService.create(createClassificationDto);
  }
    
  @Get()
  @Unprotected()
  findAll(@Query() paramDto: PaginationParams) {
    return this.classificationService.findAll(paramDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classificationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassificationDto: UpdateClassificationDto) {
    return this.classificationService.update(id, updateClassificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classificationService.remove(id);
  }
  //Roles({ roles: [FacilityUserRoles.ADMIN] })
  //@Unprotected()
  //@ApiBody({
  //  schema: {
  //    type: 'object',
  //    properties: {

  //    },
  //  },
  //})
  //@Post("createclassifications")
  //async createAll() {
  //  var o = await this.preClassificationService.findAll({"page":0,"limit":1000,"orderBy":"ascending", "orderByColumn":"code"}); 
  //  let res = await this.classificationService.createAll(o[0][0]);
  //} 
  
}
