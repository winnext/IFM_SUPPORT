import { Inject, Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/facility.not.found.exception';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { PreCreateClassificationDto } from './dto/pre-create-classification.dto';
import { PreUpdateClassificationDto } from './dto/pre-update-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { Classification } from './entities/classification.entity';
import { PreClassification } from './entities/preclassification.entity';

@Injectable()
export class PreClassificationService {
  constructor(
    @Inject(RepositoryEnums.PRECLASSIFICATION)
    private readonly preClassificationRepository: BaseInterfaceRepository<PreClassification>,
  ) {}
  async create(preCreateClassificationDto: PreCreateClassificationDto) {
    return await this.preClassificationRepository.create(preCreateClassificationDto);
  }

  async findAll(query) {
    return await this.preClassificationRepository.findAll(query);
  }

  async findOne(id: string) {
    checkObjectIddİsValid(id);
    return await this.preClassificationRepository.findOneById(id);
  }

  async update(id: string, preUpdateClassificationDto: PreUpdateClassificationDto) {
    checkObjectIddİsValid(id);
    return await this.preClassificationRepository.update(id, preUpdateClassificationDto);
  }

  async remove(id: string) {
    const preClassification = await this.findOne(id);
    if (!preClassification) {
      throw new ClassificationNotFountException(id);
    }
    return await preClassification.remove();
  }
  
  
  async findByCriteria(key: string, val: string) {
    return await this.preClassificationRepository.findByCriteria(key, val);
  }
  async createAll(file: any): Promise<string> {
    const fs = require('fs');
    const csv = require('csv-parser');
    try {
      fs;
      createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => {
          let codearray = [];
          let parentcode = "";   
          codearray  = data.code.split("-");
          var z = 0;
          for (let j=0; j < codearray.length; j++) {
            if (codearray[j] == "00") {
              z=z+1;
            }
          }
          if (z == 0) {
            for (let i=0; i<codearray.length-1; i++ ) {
              if (parentcode == "") {
                parentcode = codearray[i];
              }
              else {
                parentcode = parentcode + "-" + codearray[i];
              }
              
            }
            if (codearray.length == 4) {
              parentcode = parentcode + "-" +  "00";
            }  
          }
          else {
            if (z == 1) {
              for (let i=0; i<codearray.length-2; i++ ) {
                if (parentcode == "") {
                  parentcode = codearray[i];
                }
                else {
                  parentcode = parentcode + "-" + codearray[i];
                }
               }
                parentcode = parentcode + "-" + "00-00"; 
            }
            else if (z == 2) {
              for (let i=0; i<codearray.length-3; i++ ) {
                if (parentcode == "") {
                  parentcode = codearray[i];
                }
                else {
                  parentcode = parentcode + "-" + codearray[i];
                }
               }
                parentcode = parentcode + "-" + "00-00-00"; 
            }
            else if (z == 3) {
              for (let i=0; i<codearray.length-4; i++ ) {
                if (parentcode == "") {
                  parentcode = codearray[i];
                } 
                else {
                  parentcode = parentcode + "-" + codearray[i];
                }
              }
              if (parentcode == "") {
                parentcode = "00-00-00-00";
              } 
              else {
                parentcode = parentcode + "-" + "00-00-00-00"; 
              }
                
            }
          } 
          var codestr = "";
          for (let t=0; t < codearray.length; t++) {
            if (codestr == "") {
              codestr =  codearray[t];
            }
            else {
              codestr = codestr + "-" + codearray[t]; 
            }
            
          }
          
          const dto = {
            key: "",
            code: codestr,
            parent_code: parentcode,
            name: data.name,
            label: data.code + " : " + data.name,
            selectable: false,
            children: [],
            
          };
          this.preClassificationRepository.create(dto);
        });

        var list = []
         list = await this.findAll({"page":0,"limit":1000,"orderBy":"descending", "orderByColumn":"code"}); 
         
          for (let j=0; j<list[0].length; j++) {
            let lst = [];

            lst = await this.findByCriteria("parent_code",list[0][j].code);
            //let lds = [];
            //for (let z = 0; z<lst.length; z++) {
            //lds.push(lst[z]._id);
            //}
            
            let dto = new PreUpdateClassificationDto();
            dto.children = lst;
            if (lst.length == 0) {
              dto.selectable = true;
            }
            dto.key = list[0][j].uuid;
           
            await this.update(list[0][j]._id,dto);
          }  

      return 'success';
    } catch { 
      return 'failed';
    }
  }
}
