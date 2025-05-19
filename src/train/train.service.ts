import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, ILike } from 'typeorm';
import { Train } from './entities/train.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { FindAllTrainsDto, SortOrder } from './dto/find-all-trains.dto';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
  ) {}

  async create(createTrainDto: CreateTrainDto): Promise<Train> {
    const train = this.trainRepository.create(createTrainDto);
    return await this.trainRepository.save(train);
  }

  async findAll(
    query: FindAllTrainsDto,
  ): Promise<{ data: Train[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      sort_by = 'departure_time',
      sort_order = SortOrder.ASC,
      search,
      ...filters
    } = query;
    const skip = (page - 1) * limit;

    const qb = this.trainRepository.createQueryBuilder('train');

    // Search term across multiple fields
    if (search) {
      qb.where('train.train_number ILIKE :search', { search: `%${search}%` })
        .orWhere('train.departure_station ILIKE :search', {
          search: `%${search}%`,
        })
        .orWhere('train.arrival_station ILIKE :search', {
          search: `%${search}%`,
        })
        .orWhere('train.platform ILIKE :search', { search: `%${search}%` });
    }

    // Filters
    if (filters.train_number) {
      qb.andWhere('train.train_number ILIKE :train_number', {
        train_number: `%${filters.train_number}%`,
      });
    }
    if (filters.departure_station) {
      qb.andWhere('train.departure_station ILIKE :departure_station', {
        departure_station: `%${filters.departure_station}%`,
      });
    }
    if (filters.arrival_station) {
      qb.andWhere('train.arrival_station ILIKE :arrival_station', {
        arrival_station: `%${filters.arrival_station}%`,
      });
    }
    if (filters.platform) {
      qb.andWhere('train.platform ILIKE :platform', {
        platform: `%${filters.platform}%`,
      });
    }
    if (filters.status) {
      qb.andWhere('train.status = :status', { status: filters.status });
    }
    if (filters.type) {
      qb.andWhere('train.type = :type', { type: filters.type });
    }
    if (filters.departure_time) {
      const departureDate = new Date(filters.departure_time);
      const start = new Date(departureDate.setHours(0, 0, 0, 0));
      const end = new Date(departureDate.setHours(23, 59, 59, 999));
      qb.andWhere('train.departure_time BETWEEN :start AND :end', {
        start,
        end,
      });
    }
    if (filters.arrival_time) {
      const arrivalDate = new Date(filters.arrival_time);
      const start = new Date(arrivalDate.setHours(0, 0, 0, 0));
      const end = new Date(arrivalDate.setHours(23, 59, 59, 999));
      qb.andWhere('train.arrival_time BETWEEN :start2 AND :end2', {
        start2: start,
        end2: end,
      });
    }

    // Sort, pagination
    qb.orderBy(`train.${sort_by}`, sort_order.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Train> {
    const train = await this.trainRepository.findOne({ where: { id } });
    if (!train) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }
    return train;
  }

  async update(id: number, updateTrainDto: UpdateTrainDto): Promise<Train> {
    const train = await this.findOne(id);
    Object.assign(train, updateTrainDto);
    return await this.trainRepository.save(train);
  }

  async remove(id: number): Promise<void> {
    const train = await this.findOne(id);
    await this.trainRepository.remove(train);
  }
}
