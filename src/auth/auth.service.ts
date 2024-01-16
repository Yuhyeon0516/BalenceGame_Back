import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async signup(email: string, password: string, nickname: string) {
        const users = await this.repo.find({ where: { email } });

        if (users.length) {
            throw new BadRequestException("이미 가입된 이메일입니다.");
        }

        const nicknames = await this.repo.find({ where: { nickname } });

        if (nicknames.length) {
            throw new BadRequestException("이미 존재하는 닉네임입니다.");
        }

        const salt = randomBytes(8).toString("hex");
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + "..." + hash.toString("hex");

        const createUser = this.repo.create({
            email,
            password: result,
            nickname,
        });
        const user = await this.repo.save(createUser);

        const payload = {
            id: user.uid,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
        });

        return Object.assign(user, { accessToken });
    }

    async signin(email: string, password: string) {
        const users = await this.repo.find({ where: { email } });

        if (!users.length) {
            throw new UnauthorizedException("가입되지 않은 이메일입니다.");
        }

        const [user] = users;

        const [salt, storedHash] = user.password.split("...");
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString("hex")) {
            throw new BadRequestException("비밀번호가 일치하지않습니다.");
        }

        const payload = {
            id: user.uid,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
        });

        return Object.assign(user, { accessToken });
    }
}
