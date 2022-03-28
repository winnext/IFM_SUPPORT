import { PartialType } from '@nestjs/swagger';
import { PreCreateClassificationDto } from './pre-create-classification.dto';

export class PreUpdateClassificationDto extends PartialType(PreCreateClassificationDto) {}
