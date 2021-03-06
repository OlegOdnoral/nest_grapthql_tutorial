import { Repository, EntityRepository } from "typeorm";
import { User } from "./entities/user.entity";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    private logger = new Logger('UserRepository');

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {

        const { username, password } = authCredentialsDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        try {
            await user.save();
        } catch (error) {
            // 23505 - duplicate exception
            if(error.code === '23505') {
                throw new ConflictException('Username already exist');
            } else {
                this.logger.error(`Unknown error with code ${error.code}`, error.stack);
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });
        if(user && await user.validatePassword(password)) {
            return user.username;
        }
        return null;
    }
    
    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }

}