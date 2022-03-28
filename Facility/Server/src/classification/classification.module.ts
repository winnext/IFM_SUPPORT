import { forwardRef, Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import { Classification, ClassificationSchema } from './entities/classification.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { ClassificationRepository } from './repositories/classification.repository';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { PreClassificationService } from './pre-classification.service';
import { PreClassificationRepository } from './repositories/preclassification.repository';
import { PreClassificationModule } from './pre-classification.module';

@Module({
  imports: [
    
    MongooseModule.forFeature(
      [
        {
          name: Classification.name,
          schema: ClassificationSchema,
        },
      ],
      ConnectionEnums.CLASSIFICATION,
    ),

    forwardRef(() => PreClassificationModule),  //using forwardRef() becaouse of circular dependency 
  ],
  controllers: [ClassificationController],
  providers: [
    ClassificationService,
    {
      provide: RepositoryEnums.CLASSIFICATION,
      useClass: ClassificationRepository,
    },
    
  ],
  exports:[ClassificationService]
})
export class ClassificationModule {}
