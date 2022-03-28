import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsObject, IsString, Length } from 'class-validator';

export class PreCreateClassificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  class_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  parent_code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  parent: string;

  @IsDate()
  updatedAt = new Date();

  @ApiProperty()
  @IsArray()
  children: object[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  selectable: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  label: string;
}
