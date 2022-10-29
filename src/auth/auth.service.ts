import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDTO, ResetPasswordDTO } from './dto';
import { NextFunction, Response } from 'express';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UtilityService } from '../utility/utility.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _utility: UtilityService,
    private readonly _jwt: JwtService,
    private readonly _config: ConfigService,
  ) {}

  /**
   *
   * @param createUserDTO
   * @param res
   * @param next
   * @returns
   */
  public createUser = async (
    createUserDTO: CreateUserDto,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const hash = await argon.hash(createUserDTO?.password);
      const result = await this._prisma.user.create({
        data: {
          email: createUserDTO.email,
          first_name: createUserDTO.first_name,
          last_name: createUserDTO.last_name,
          hash,
        },
        select: {
          first_name: true,
          last_name: true,
          email: true,
          user_id: true,
          created_at: true,
          updated_at: true,
        },
      });
      if (result) {
        const token = await this.signToken(result.user_id);
        return this._utility.responseTransform(
          res,
          this._utility.http_status.OK,
          true,
          result,
          'Account Successfully Created!',
          token,
        );
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return this._utility.responseTransform(
            res,
            this._utility.http_status.CONFLICT,
            false,
            null,
            'Email already taken!',
          );
        } else {
          next(error);
        }
      } else {
        next(error);
      }
    }
  };
  /**
   *
   * @param LoginDTO
   * @param res
   * @param next
   * @returns
   */
  public async createsign(
    LoginDTO: LoginDTO,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await this._prisma.user.findUnique({
        where: {
          email: LoginDTO.email,
        },
        select: {
          first_name: true,
          last_name: true,
          email: true,
          user_id: true,
          created_at: true,
          updated_at: true,
          hash: true,
        },
      });
      if (!result) {
        return this._utility.responseTransform(
          res,
          this._utility.http_status.CONFLICT,
          false,
          null,
          'No User found!',
        );
      } else {
        if (await argon.verify(result.hash, LoginDTO.password)) {
          const token = await this.signToken(result.user_id);
          delete result.hash;
          return this._utility.responseTransform(
            res,
            this._utility.http_status.OK,
            true,
            result,
            'Login session Successfully Created!',
            token,
          );
        } else {
          return this._utility.responseTransform(
            res,
            this._utility.http_status.CONFLICT,
            false,
            null,
            'Password did not match!',
          );
        }
      }
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param ResetPasswordDTO
   * @param next
   * @returns
   */
  public resetpassword(ResetPasswordDTO: ResetPasswordDTO, next: NextFunction) {
    return 'This resets password';
  }

  /**
   *
   * @param userId
   * @returns {Promise<string>} token
   */
  private async signToken(userId: number): Promise<string> {
    const payload: object = {
      sub: userId,
    };
    const token = await this._jwt.signAsync(payload, {
      secret: this._config.get('SECRET_KEY'),
      expiresIn: this._config.get('EXPIRES_IN'),
    });
    // maintain the tokens
    // this._prisma.authtoken.create({
    //   data: {
    //     token,
    //     client_info: {},
    //   },
    // });
    return token;
  }
}
