import { Inject, Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/facility.not.found.exception';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { Classification } from './entities/classification.entity';

@Injectable()
export class ClassificationService {
  constructor(
    @Inject(RepositoryEnums.CLASSIFICATION)
    private readonly classificationRepository: BaseInterfaceRepository<Classification>,
  ) {}
  async create(createClassificationDto: CreateClassificationDto) {
    return await this.classificationRepository.create(createClassificationDto);
  }

  async findAll(query) {
    return await this.classificationRepository.findAll(query);
  }

  async findOne(id: string) {
    checkObjectIddİsValid(id);
    return await this.classificationRepository.findOneById(id);
  }

  async update(id: string, updateClassificationDto: UpdateClassificationDto) {
    checkObjectIddİsValid(id);
    return await this.classificationRepository.update(id, updateClassificationDto);
  }

  async remove(id: string) {
    const classification = await this.findOne(id);
    if (!classification) {
      throw new ClassificationNotFountException(id);
    }
    return await classification.remove();
  }

  async createAll(o: any, dt:any): Promise<string> {
  
    const dto = {
      code: o.code,
      name: o.name,
      label: [dt],
      detail: {"root":o},
      updatedAt: new Date()
    };
    this.classificationRepository.create(dto);
    return "1";
  }
}
