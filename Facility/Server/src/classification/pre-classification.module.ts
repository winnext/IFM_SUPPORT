import { forwardRef, Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import { Classification, ClassificationSchema } from './entities/classification.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { ClassificationRepository } from './repositories/classification.repository';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { PreClassification, PreClassificationSchema } from './entities/preclassification.entity';
import { PreClassificationController } from './pre-classification.controller';
import { PreClassificationService } from './pre-classification.service';
import { PreClassificationRepository } from './repositories/preclassification.repository';
import { ClassificationModule } from './classification.module';


@Module({
  imports: [
    
    MongooseModule.forFeature(
      [
        {
          name: PreClassification.name,
          schema: PreClassificationSchema,
        },
      ],
      ConnectionEnums.PRECLASSIFICATION,
    ),
    forwardRef(() => ClassificationModule),  //using forwardRef() becaouse of circular dependency 
  ],
  controllers: [PreClassificationController],
  providers: [
    PreClassificationService,
    {
      provide: RepositoryEnums.PRECLASSIFICATION,
      useClass: PreClassificationRepository,
      
    },
  ],
  exports:[PreClassificationService]
})
export class PreClassificationModule {}
