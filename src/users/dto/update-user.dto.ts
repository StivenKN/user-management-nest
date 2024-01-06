import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  full_name?: string;
  email?: string;
  db_namespace?: string;
  password?: string;
}
