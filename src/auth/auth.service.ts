import { BadRequest, Unauthorized } from 'http-errors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../core/database';
import { User } from '../users/users.entity';
import { Token } from './token.entity';
import { ROUNDS_NUMBER } from '../core/constant'
import { ForgotPasswordDTO, ResetPasswordDTO, SignupDTO } from './auth.dto';
import { MoreThan } from 'typeorm';
import { randomBytes } from 'crypto';
import { sendEmail } from '../core/utils/send-email.util';

const userRepo = AppDataSource.getRepository(User);
const tokenRepo = AppDataSource.getRepository(Token);

export async function signup(signupDTO: SignupDTO) {
    const duplicatedUser = await userRepo.findOneBy({
        email: signupDTO.email
    });
    if (duplicatedUser) {
        throw new BadRequest('Email already existed');
    }
    const newUser = new User(signupDTO);

    newUser.hashedPassword = await bcrypt.hash(signupDTO.password, ROUNDS_NUMBER);
    await userRepo.save(newUser);
    delete newUser.hashedPassword;
    return newUser;
}

export async function signin(email: string, password: string) {
    const user = await userRepo.findOne({
        where: {
            email: email
        },
        select: ['address', 'birthday', 'createdAt', 'deletedAt', 'updatedAt', 'email', 'fullname', 'gender', 'hashedPassword', 'id', 'numberPhone', 'role']
    });

    if (!user) {
        throw new Unauthorized('Email or password is incorrect');
    }
    const isValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isValid) {
        throw new Unauthorized('Email or password is incorrect');
    }

    const payload = { id: user.id, email: user.email, role: user.role }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION });

    const { hashedPassword, ...newUser } = user;

    return { information: newUser, accessToken };
}

export async function forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
    const user = await userRepo.findOne({
        where: {
            email: forgotPasswordDTO.email
        },
        select: ['id', 'email']
    });

    if (!user) {
        throw new Unauthorized('User with given email does not exist');
    }

    let token = await tokenRepo.findOne({
        where: {
            user: user,
            expiredAt: MoreThan(new Date())
        }
    })

    console.log(token);

    if (!token) {
        token = new Token({
            user: user,
            token: randomBytes(32).toString("hex"),
            expiredAt: new Date(Date.now() + +process.env.EXPIRED_RESET_PASSWORD_TOKEN)
        });
        await tokenRepo.save(token);
    }
    const resetPasswordLink = `${process.env.WEB_FORGOT_PASSWORD_URL}/${user.id}/${token.token}`;

    sendEmail({
        email: user.email,
        subject: "Goldduck Camera - Password reset",
        template: 'reset-password',
        context: { resetPasswordLink }
    }).catch(error => console.log(error));
}

export async function resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const user = await userRepo.findOne({
        where: {
            id: resetPasswordDTO.id
        },
        select: ['id', 'email', 'hashedPassword', 'role'],
    });

    if (!user) {
        throw new Unauthorized('Invalid link or expired');
    }

    let token = await tokenRepo.findOne({
        where: {
            user: user,
            token: resetPasswordDTO.token,
            expiredAt: MoreThan(new Date())
        }
    })

    if (!token) {
        throw new Unauthorized('Invalid link or expired');
    }

    user.hashedPassword = await bcrypt.hash(resetPasswordDTO.password, ROUNDS_NUMBER);
    await userRepo.save(user);
    await tokenRepo.delete(token.id);
}