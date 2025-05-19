import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TrainStatus {
  scheduled = 'scheduled',
  delayed = 'delayed',
  cancelled = 'cancelled',
  arrived = 'arrived',
  departed = 'departed',
}

export enum TrainType {
  passenger = 'passenger',
  freight = 'freight',
  express = 'express',
}

@Entity({ name: 'train' })
export class Train {
  @ApiProperty({ description: 'The unique identifier of the train' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The number of the train', example: 'IT044' })
  @Column({ type: 'varchar', unique: true, length: 255 })
  train_number: string;

  @ApiProperty({
    description: 'The name of departure station',
    example: 'Kyiv',
  })
  @Column({ type: 'varchar', length: 255 })
  departure_station: string;

  @ApiProperty({
    description: 'The name of arrival station',
    example: 'Lviv',
  })
  @Column({ type: 'varchar', length: 255 })
  arrival_station: string;

  @ApiProperty({
    description: 'The date and time of departure',
    example: '2023-10-01T12:00:00Z',
  })
  @Column({ type: 'timestamp' })
  departure_time: Date;

  @ApiProperty({
    description: 'The date and time of arrival',
    example: '2023-10-01T15:00:00Z',
  })
  @Column({ type: 'timestamp' })
  arrival_time: Date;

  @ApiProperty({
    description: 'Arrival platform of the train',
    example: 'Platform 1',
  })
  @Column({ type: 'varchar', length: 255 })
  platform: string;

  @ApiProperty({
    description: 'The status of the train',
    enum: TrainStatus,
    example: TrainStatus.scheduled,
  })
  @Column({
    type: 'enum',
    enum: TrainStatus,
    default: TrainStatus.scheduled,
  })
  status: TrainStatus;

  @ApiProperty({
    description: 'The type of the train',
    enum: TrainType,
    example: TrainType.passenger,
  })
  @Column({
    type: 'enum',
    enum: TrainType,
    default: TrainType.passenger,
  })
  type: TrainType;
}
