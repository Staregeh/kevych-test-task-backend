import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TrainStatus, TrainType } from '../entities/train.entity';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FindAllTrainsDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search text across train number, stations, and platform',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: [
      'train_number',
      'departure_station',
      'arrival_station',
      'departure_time',
      'arrival_time',
      'platform',
      'status',
      'type',
    ],
    default: 'departure_time',
  })
  @IsString()
  @IsOptional()
  sort_by?: string = 'departure_time';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: SortOrder,
    default: SortOrder.ASC,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sort_order?: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({ description: 'Filter by train number' })
  @IsString()
  @IsOptional()
  train_number?: string;

  @ApiPropertyOptional({ description: 'Filter by departure station' })
  @IsString()
  @IsOptional()
  departure_station?: string;

  @ApiPropertyOptional({ description: 'Filter by arrival station' })
  @IsString()
  @IsOptional()
  arrival_station?: string;

  @ApiPropertyOptional({ description: 'Filter by platform' })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiPropertyOptional({
    enum: TrainStatus,
    description: 'Filter by train status',
  })
  @IsEnum(TrainStatus)
  @IsOptional()
  status?: TrainStatus;

  @ApiPropertyOptional({ enum: TrainType, description: 'Filter by train type' })
  @IsEnum(TrainType)
  @IsOptional()
  type?: TrainType;

  @ApiPropertyOptional({
    description: 'Filter by departure time (ISO date string)',
  })
  @IsString()
  @IsOptional()
  departure_time?: string;

  @ApiPropertyOptional({
    description: 'Filter by arrival time (ISO date string)',
  })
  @IsString()
  @IsOptional()
  arrival_time?: string;
}
