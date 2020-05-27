import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import { typeOrmConfig } from '../config/typeorm.config';
import * as config from 'config';

const jwtConfig = config.get('jwt');

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ 
          defaultStrategy: 'jwt' 
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET || jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          }
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([
          UserRepository,
        ]),
      ],
      providers: [
        AuthService,
        JwtStrategy
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
