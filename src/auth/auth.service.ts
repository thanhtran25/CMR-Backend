import { BadRequest, Unauthorized } from 'http-errors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../core/database';
import { User } from '../users/users.entity';
import { ROUNDS_NUMBER } from '../core/constant'

const userRepo = AppDataSource.getRepository(User);

export async function signup(user: any) {
    const duplicatedUser = await userRepo.findOneBy({
        email: user.email
    });
    if (duplicatedUser) {
        throw new BadRequest('Email already is invalid');
    }
    const hashPassword = await bcrypt.hash(user.password, ROUNDS_NUMBER);
    delete user.password;
    user.hashedPassword = hashPassword;
    if (user.numberPhone) {
        user.numberPhone = parseInt(user.numberPhone, 10);
    }
    await userRepo.save(user);
    return { success: true };
}

export async function signin(email: string, password: string) {
    const user = await userRepo.findOneBy({
        email: email
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

    const { createdAt, updatedAt, hashedPassword, ...newUser } = user;

    return { success: true, information: newUser, accessToken };
}
