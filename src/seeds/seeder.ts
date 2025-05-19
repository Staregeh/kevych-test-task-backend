import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Train, TrainStatus, TrainType } from '../train/entities/train.entity';
import * as bcrypt from 'bcrypt';

export class Seeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    await this.seedUsers();
    await this.seedTrains();
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('password', 10);
      const adminUser = userRepository.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        is_admin: true,
      });
      await userRepository.save(adminUser);
      console.log('Admin user created successfully');
    }
  }

  private async seedTrains() {
    const trainRepository = this.dataSource.getRepository(Train);

    // Check if trains already exist
    const existingTrains = await trainRepository.count();
    if (existingTrains > 0) {
      console.log('Trains already exist, skipping seeding');
      return;
    }

    const stations = [
      'Kyiv',
      'Lviv',
      'Kharkiv',
      'Odesa',
      'Dnipro',
      'Zaporizhzhia',
      'Vinnytsia',
      'Poltava',
      'Sumy',
      'Chernihiv',
    ];

    const trainTypes = Object.values(TrainType);
    const trainStatuses = Object.values(TrainStatus);

    const trains: Train[] = [];

    for (let i = 0; i < 10; i++) {
      const departureStation =
        stations[Math.floor(Math.random() * stations.length)];
      let arrivalStation;
      do {
        arrivalStation = stations[Math.floor(Math.random() * stations.length)];
      } while (arrivalStation === departureStation);

      const departureTime = new Date();
      departureTime.setHours(
        departureTime.getHours() + Math.floor(Math.random() * 24),
      );

      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(
        arrivalTime.getHours() + Math.floor(Math.random() * 12) + 1,
      );

      const train = trainRepository.create({
        train_number: `TR${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, '0')}`,
        departure_station: departureStation,
        arrival_station: arrivalStation,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        platform: `Platform ${Math.floor(Math.random() * 10) + 1}`,
        status: trainStatuses[
          Math.floor(Math.random() * trainStatuses.length)
        ] as TrainStatus,
        type: trainTypes[
          Math.floor(Math.random() * trainTypes.length)
        ] as TrainType,
      });

      trains.push(train);
    }

    await trainRepository.save(trains);
    console.log('Trains seeded successfully');
  }
}
