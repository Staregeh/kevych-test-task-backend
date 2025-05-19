import { DataSource } from 'typeorm';
import { Train, TrainStatus, TrainType } from '../train/entities/train.entity';
import { User } from '../user/entities/user.entity';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'train_schedule',
  entities: [Train, User],
  synchronize: true,
});

const trainData = [
  {
    train_number: 'IT044',
    departure_station: 'Kyiv',
    arrival_station: 'Lviv',
    departure_time: new Date('2024-03-20T08:00:00Z'),
    arrival_time: new Date('2024-03-20T12:00:00Z'),
    platform: 'Platform 1',
    status: TrainStatus.scheduled,
    type: TrainType.passenger,
  },
  {
    train_number: 'IT045',
    departure_station: 'Lviv',
    arrival_station: 'Kyiv',
    departure_time: new Date('2024-03-20T14:00:00Z'),
    arrival_time: new Date('2024-03-20T18:00:00Z'),
    platform: 'Platform 2',
    status: TrainStatus.delayed,
    type: TrainType.express,
  },
  {
    train_number: 'FR001',
    departure_station: 'Kharkiv',
    arrival_station: 'Odesa',
    departure_time: new Date('2024-03-20T10:00:00Z'),
    arrival_time: new Date('2024-03-20T16:00:00Z'),
    platform: 'Platform 3',
    status: TrainStatus.scheduled,
    type: TrainType.freight,
  },
  {
    train_number: 'IT046',
    departure_station: 'Dnipro',
    arrival_station: 'Kyiv',
    departure_time: new Date('2024-03-20T09:00:00Z'),
    arrival_time: new Date('2024-03-20T13:00:00Z'),
    platform: 'Platform 4',
    status: TrainStatus.arrived,
    type: TrainType.passenger,
  },
  {
    train_number: 'IT047',
    departure_station: 'Odesa',
    arrival_station: 'Kharkiv',
    departure_time: new Date('2024-03-20T11:00:00Z'),
    arrival_time: new Date('2024-03-20T17:00:00Z'),
    platform: 'Platform 5',
    status: TrainStatus.scheduled,
    type: TrainType.express,
  },
  {
    train_number: 'FR002',
    departure_station: 'Kyiv',
    arrival_station: 'Dnipro',
    departure_time: new Date('2024-03-20T13:00:00Z'),
    arrival_time: new Date('2024-03-20T16:00:00Z'),
    platform: 'Platform 6',
    status: TrainStatus.scheduled,
    type: TrainType.freight,
  },
  {
    train_number: 'IT048',
    departure_station: 'Lviv',
    arrival_station: 'Odesa',
    departure_time: new Date('2024-03-20T15:00:00Z'),
    arrival_time: new Date('2024-03-20T22:00:00Z'),
    platform: 'Platform 7',
    status: TrainStatus.cancelled,
    type: TrainType.passenger,
  },
  {
    train_number: 'IT049',
    departure_station: 'Kharkiv',
    arrival_station: 'Dnipro',
    departure_time: new Date('2024-03-20T16:00:00Z'),
    arrival_time: new Date('2024-03-20T18:00:00Z'),
    platform: 'Platform 8',
    status: TrainStatus.departed,
    type: TrainType.express,
  },
  {
    train_number: 'FR003',
    departure_station: 'Odesa',
    arrival_station: 'Lviv',
    departure_time: new Date('2024-03-20T17:00:00Z'),
    arrival_time: new Date('2024-03-21T02:00:00Z'),
    platform: 'Platform 9',
    status: TrainStatus.scheduled,
    type: TrainType.freight,
  },
  {
    train_number: 'IT050',
    departure_station: 'Kyiv',
    arrival_station: 'Kharkiv',
    departure_time: new Date('2024-03-20T19:00:00Z'),
    arrival_time: new Date('2024-03-21T00:00:00Z'),
    platform: 'Platform 10',
    status: TrainStatus.scheduled,
    type: TrainType.passenger,
  },
];

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const trainRepository = dataSource.getRepository(Train);
    const userRepository = dataSource.getRepository(User);

    await trainRepository.clear();
    console.log('Cleared existing train data');

    await userRepository.clear();
    console.log('Cleared existing user data');

    for (const train of trainData) {
      await trainRepository.save(train);
    }
    console.log('Successfully seeded train data');

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is not set');
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = userRepository.create({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      is_admin: true,
    });

    await userRepository.save(adminUser);
    console.log('Successfully created admin user');

    await dataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
