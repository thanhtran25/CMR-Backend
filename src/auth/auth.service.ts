import { BadRequest, Unauthorized } from 'http-errors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../core/database';
import { User } from '../users/users.entity';
import { ROUNDS_NUMBER } from '../core/constant'
import { SignupDTO } from './auth.dto';

const userRepo = AppDataSource.getRepository(User);

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

    console.log(user);

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
