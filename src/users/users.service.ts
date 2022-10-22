import { BadRequest, Unauthorized } from 'http-errors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../core/database';
import { User } from '../users/users.entity';
import { ROUNDS_NUMBER } from '../core/constant'

const userRepo = AppDataSource.getRepository(User);

export async function createUser(user: any) {
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
    const { createdAt, updatedAt, deletedAt, hashedPassword, ...newUser } = user;
    return { success: true, information: newUser };
}

export async function updateUser(id: number, dataUpdate: any) {
    const user = await userRepo.findOneBy({
        id: id
    });

    if (!user) {
        throw new BadRequest('User not found');
    }

    if (dataUpdate.password) {
        const hashPassword = await bcrypt.hash(dataUpdate.password, ROUNDS_NUMBER);
        dataUpdate.hashedPassword = hashPassword;
        delete dataUpdate.password;
    }

    if (dataUpdate.numberPhone) {
        dataUpdate.numberPhone = parseInt(dataUpdate.numberPhone, 10);
    }

    dataUpdate.id = id;

    await userRepo.update(id, dataUpdate);
    return { success: true, information: dataUpdate };
}

export async function deleteUser(id: number) {
    const user = await userRepo.findOneBy({
        id: id
    });

    if (!user) {
        throw new BadRequest('User not found');
    }

    await userRepo.softDelete(id);
    return { success: true };
}
