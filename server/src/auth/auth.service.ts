import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
  ) {}

  private publicUser(user: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string | null;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl ?? null,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password,
    });

    return {
      message: 'User registered successfully',
      user: this.publicUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      user: this.publicUser(user),
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = await this.usersService.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('Email already taken');
      }
    }

    const imageUrl = file
      ? await this.cloudinaryService.uploadImage(file.buffer)
      : undefined;
    const updated = await this.usersService.update(userId, {
      name: dto.name,
      email: dto.email,
      imageUrl,
    });
    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Profile updated successfully',
      user: this.publicUser(updated),
    };
  }
}
