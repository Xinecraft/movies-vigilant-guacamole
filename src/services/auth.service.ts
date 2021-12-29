import { compare, hash } from 'bcrypt';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '@/dtos/create-user.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { LoginUserDto } from '@/dtos/login-user.dto';

@EntityRepository()
class AuthService extends Repository<UserEntity> {
  public async signup(userData: CreateUserDto): Promise<Partial<User>> {
    if (isEmpty(userData)) throw new HttpException(400, 'UserData is not valid');

    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(422, `Your email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = createUserData;
    return result;
  }

  public async login(userData: LoginUserDto): Promise<{ cookie: string; findUser: Partial<User>; token: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(400, 'UserData is not valid');

    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(400, 'Invalid Login credentials');

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(400, 'Invalid Login credentials');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = findUser;
    return { cookie, findUser: result, token: tokenData };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User Data is not valid');

    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(404, "You're not user maybe");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
