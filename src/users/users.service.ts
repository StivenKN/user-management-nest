import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import hashPassword from 'src/lib/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (userExists)
      throw new HttpException('This user already exists.', HttpStatus.CONFLICT);

    const hash = await hashPassword(createUserDto.password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findBy({ id });
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findBy({ id });
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    if (updateUserDto.password)
      updateUserDto.password = await hashPassword(updateUserDto.password);

    const userUpdated = await this.userRepository.update(id, updateUserDto);
    if (userUpdated.affected === 0)
      throw new HttpException('User has not changed.', HttpStatus.NOT_FOUND);
    return user;
  }

  async remove(id: number) {
    const user = await this.userRepository.softDelete({ id });
    if (user.affected === 0)
      throw new HttpException('User not found.', HttpStatus.AMBIGUOUS);
    return user;
  }
}
