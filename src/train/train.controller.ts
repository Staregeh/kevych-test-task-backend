import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TrainService } from './train.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { Train } from './entities/train.entity';
import { Admin } from 'src/auth/decorators/admin.decorator';
import { FindAllTrainsDto } from './dto/find-all-trains.dto';

@ApiTags('trains')
@Controller('trains')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Admin()
  @Post()
  @ApiOperation({ summary: 'Create a new train' })
  @ApiResponse({
    status: 201,
    description: 'The train has been successfully created.',
    type: Train,
  })
  create(@Body() createTrainDto: CreateTrainDto) {
    return this.trainService.create(createTrainDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trains with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return filtered and paginated trains.',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Train' },
        },
        total: {
          type: 'number',
          description: 'Total number of trains matching the filters',
        },
        page: {
          type: 'number',
          description: 'Current page number',
        },
        limit: {
          type: 'number',
          description: 'Number of items per page',
        },
      },
    },
  })
  findAll(@Query() query: FindAllTrainsDto) {
    return this.trainService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a train by id' })
  @ApiResponse({ status: 200, description: 'Return the train.', type: Train })
  @ApiResponse({ status: 404, description: 'Train not found.' })
  findOne(@Param('id') id: string) {
    return this.trainService.findOne(+id);
  }

  @Admin()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a train' })
  @ApiResponse({
    status: 200,
    description: 'The train has been successfully updated.',
    type: Train,
  })
  @ApiResponse({ status: 404, description: 'Train not found.' })
  update(@Param('id') id: string, @Body() updateTrainDto: UpdateTrainDto) {
    return this.trainService.update(+id, updateTrainDto);
  }

  @Admin()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a train' })
  @ApiResponse({
    status: 200,
    description: 'The train has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Train not found.' })
  remove(@Param('id') id: string) {
    return this.trainService.remove(+id);
  }
}
