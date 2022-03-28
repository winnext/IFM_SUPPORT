import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type PreClassificationDocument = PreClassification & Document;

@Schema()
export class PreClassification extends Document {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  uuid: string;

  @Prop({ type: Object })
  children: object[];

  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  class_name: string;

  @Prop()
  parent_code: string;

  @Prop()
  parent: string;

  @Prop({
    type: Date,
    default: function genDate() {
      return new Date();
    },
  })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  key: string;

  @Prop()
  selectable: boolean;

  @Prop()
  label: string;
  
}

export const PreClassificationSchema = SchemaFactory.createForClass(PreClassification);
