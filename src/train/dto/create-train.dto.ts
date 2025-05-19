import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { TrainStatus, TrainType } from '../entities/train.entity';

export class CreateTrainDto {
  @ApiProperty({ description: 'The number of the train', example: 'IT044' })
  @IsNotEmpty()
  @IsString()
  train_number: string;

  @ApiProperty({
    description: 'The name of departure station',
    example: 'Kyiv',
  })
  @IsNotEmpty()
  @IsString()
  departure_station: string;

  @ApiProperty({ description: 'The name of arrival station', example: 'Lviv' })
  @IsNotEmpty()
  @IsString()
  arrival_station: string;

  @ApiProperty({
    description: 'The date and time of departure',
    example: '2023-10-01T12:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  departure_time: Date;

  @ApiProperty({
    description: 'The date and time of arrival',
    example: '2023-10-01T15:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  arrival_time: Date;

  @ApiProperty({
    description: 'Arrival platform of the train',
    example: 'Platform 1',
  })
  @IsNotEmpty()
  @IsString()
  platform: string;

  @ApiProperty({
    description: 'The status of the train',
    enum: TrainStatus,
    example: TrainStatus.scheduled,
  })
  @IsEnum(TrainStatus)
  status: TrainStatus;

  @ApiProperty({
    description: 'The type of the train',
    enum: TrainType,
    example: TrainType.passenger,
  })
  @IsEnum(TrainType)
  type: TrainType;
}
