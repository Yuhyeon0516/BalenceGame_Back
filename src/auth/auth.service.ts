import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

function randomNicknameGenerator() {
    const names = [
        "미르",
        "미리내",
        "온새미로",
        "시나브로",
        "가람",
        "그린비",
        "아라",
        "마루",
        "가온길",
        "비나리",
        "한울",
        "윤슬",
        "물비늘",
        "타니",
        "나린",
        "아리아",
        "수피아",
        "푸실",
        "아토",
        "희나리",
        "단미",
        "휘들램",
    ];

    const name = names[Math.floor(Math.random() * names.length)];
    const number = Math.floor(Math.random() * 9999);

    return `${name}${number}`;
}

async function hashingPassword(password: string) {
    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + "..." + hash.toString("hex");

    return result;
}

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

        const hashedPassword = await hashingPassword(password);

        const createUser = this.repo.create({
            email,
            password: hashedPassword,
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

    async findByEmail(email: string) {
        const user = await this.repo.findOne({ where: { email } });

        return user || null;
    }

    async findById(id: number) {
        const users = await this.repo.find({ where: { uid: id } });

        return users[0] || null;
    }

    async createSocialUser(email: string) {
        const nickname = randomNicknameGenerator();
        const password = await hashingPassword("oauth");

        const createdUser = this.repo.create({
            email,
            password,
            nickname,
        });
        const user = await this.repo.save(createdUser);

        const payload = {
            id: user.uid,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
        });

        return Object.assign(user, { accessToken });
    }

    async signinNaver(code: string, state: string) {}

    async signinKakao(code: string) {
        const clientId = this.configService.get<string>("KAKAO_RESTAPI_KEY");
        const clientSecret = this.configService.get<string>(
            "KAKAO_CLIENT_SECRET",
        );
        const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${clientId}&redirect_uri=http://localhost:8080/auth/social/kakao&code=${code}&client_secret=${clientSecret}`;
        const res = await axios.get(tokenUrl);

        const socialAccessToken = res.data.access_token;
        const headers = {
            Authorization: "Bearer " + socialAccessToken,
        };

        const profileUrl = "https://kapi.kakao.com/v2/user/me";

        const {
            data: {
                kakao_account: { email },
            },
        } = await axios.get(profileUrl, { headers });

        let user = await this.repo.findOne({ where: { email } });

        if (!user) {
            const nickname = randomNicknameGenerator();
            const password = await hashingPassword("oauth");

            const createdUser = this.repo.create({
                email,
                password,
                nickname,
            });
            user = await this.repo.save(createdUser);
        }

        const payload = {
            id: user.uid,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
        });

        return Object.assign(user, { accessToken });
    }

    generateToken(user: User) {
        const payload = {
            id: user.uid,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
        });

        return Object.assign(user, { accessToken });
    }
}
