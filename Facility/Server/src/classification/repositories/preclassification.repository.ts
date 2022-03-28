import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/facility.not.found.exception';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { PreCreateClassificationDto } from '../dto/pre-create-classification.dto';
import { PreUpdateClassificationDto } from '../dto/pre-update-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';

import { Classification } from '../entities/classification.entity';
import { PreClassification } from '../entities/preclassification.entity';

@Injectable()
export class PreClassificationRepository implements BaseInterfaceRepository<PreClassification> {
  constructor(
    @InjectModel(PreClassification.name)
    private readonly preClassificationModel: Model<PreClassification>,
  ) {}
  findWithRelations(relations: any): Promise<PreClassification[]> {
    throw new Error(relations);
  }
  async findOneById(id: string): Promise<PreClassification> {
    const preClassification = await this.preClassificationModel.findById({ _id: id }).exec();
    if (!preClassification) {
      throw new ClassificationNotFountException(id);
    }

    return preClassification;
  }
  async findAll(data: PaginationParams) {
    let { page, limit, orderBy, orderByColumn } = data;
    page = page || 0;
    limit = limit || 5;
    orderBy = orderBy || 'ascending';

    orderByColumn = orderByColumn || 'name';
    const count = parseInt((await this.preClassificationModel.find().count()).toString());
    const pagecount = Math.ceil(count / limit);
    let pg = parseInt(page.toString());
    const lmt = parseInt(limit.toString());
    if (pg > pagecount) {
      pg = pagecount;
    }
    let skip = pg * lmt;
    if (skip >= count) {
      skip = count - lmt;
      if (skip < 0) {
        skip = 0;
      }
    }
    const result = await this.preClassificationModel
      .find()
      .skip(skip)
      .limit(lmt)
      .sort([[orderByColumn, orderBy]])
      .exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const preClassification = [];
    preClassification.push(result);
    preClassification.push(pagination);

    return preClassification;
  }

  async create(preCreateClassificationDto: PreCreateClassificationDto) {
    const preClassification = new this.preClassificationModel(preCreateClassificationDto);

    return await preClassification.save();
  }
  async update(_id: string, preUpdateClassificationto: PreUpdateClassificationDto) {
    const preUpdatedClassification = await this.preClassificationModel
      .findOneAndUpdate({ _id }, { $set: preUpdateClassificationto }, { new: true })
      .exec();

    if (!preUpdatedClassification) {
      throw new ClassificationNotFountException(_id);
    }

    return preUpdatedClassification;
  }
  async delete(_id: string) {
    const preClassification = await this.findOneById(_id);
    return this.preClassificationModel.remove(preClassification);
  }
  async findByCriteria(key: string, val: string ) {

    let list = await this.preClassificationModel.find({"parent_code": val}).sort([["code", "ascending"]]);
    return list;
  }

}