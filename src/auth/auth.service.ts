import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    async signup(email: string, password: string, nickname: string) {
        const users = await this.repo.find({ where: { email } });

        if (users.length) {
            throw new BadRequestException('이미 가입된 이메일입니다.');
        }

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + '...' + hash.toString('hex');

        const user = this.repo.create({ email, password: result, nickname });

        return this.repo.save(user);
    }
}
