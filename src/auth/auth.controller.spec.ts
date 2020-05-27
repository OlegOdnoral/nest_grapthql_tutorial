import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { typeOrmConfig } from '../config/typeorm.config';
import * as config from 'config';

const jwtConfig = config.get('jwt');

describe('Auth Controller', () => {
  let controller: AuthController;

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
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
