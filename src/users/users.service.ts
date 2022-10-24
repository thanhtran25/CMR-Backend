import { BadRequest, Unauthorized } from 'http-errors';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../core/database';
import { User } from '../users/users.entity';
import { ROUNDS_NUMBER } from '../core/constant'
import { ChangePassword, CreateUserDTO, FilterUser, UpdateUserDTO } from './users.dto';
import { Like } from 'typeorm';
import { object } from 'joi';

const userRepo = AppDataSource.getRepository(User);

export async function getUsers(pageNumber: number, pageSize: number, filter: FilterUser) {
    const offset = pageSize * (pageNumber - 1);
    const limit = pageSize;
    let where: {
        fullname?: any;
        address?: any;
        gender?: any;
    } = {};

    if (filter.name) {
        where.fullname = Like(`%${filter.name}%`)
    }
    if (filter.address) {
        where.address = Like(`%${filter.address}%`)
    }
    if (filter.gender) {
        where.gender = filter.gender
    }
    const users = await userRepo.find({
        skip: offset,
        take: limit,
        where: where
    });

    return users;
}

export async function getUser(id: number) {
    const user = await userRepo.findOneBy({
        id: id
    });
    if (!user) {
        throw new BadRequest('User not found');
    }
    return user;
}

export async function createUser(createUserDTO: CreateUserDTO) {
    const duplicatedUser = await userRepo.findOneBy({
        email: createUserDTO.email
    });
    if (duplicatedUser) {
        throw new BadRequest('Email already existed');
    }
    const newUser = new User(createUserDTO);
    newUser.hashedPassword = await bcrypt.hash(createUserDTO.password, ROUNDS_NUMBER);

    await userRepo.save(newUser);
    delete newUser.hashedPassword;
    return newUser;
}

export async function updateUser(id: number, updateUserDTO: UpdateUserDTO) {
    let user = await userRepo.findOneBy({
        id: id
    });

    if (!user) {
        throw new BadRequest('User not found');
    }
    user = {
        ...user,
        ...updateUser,
    }
    await userRepo.update(id, user);

    delete user.hashedPassword;
    return user;
}

export async function deleteUser(id: number) {
    const user = await userRepo.findOneBy({
        id: id
    });

    if (!user) {
        throw new BadRequest('User not found');
    }

    await userRepo.softDelete(id);
}

export async function changePassword(changePassword: ChangePassword, email: string) {
    const user = await userRepo.findOne({
        where: {
            email: email
        },
        select: ['hashedPassword', 'id']
    });

    const isValid = await bcrypt.compare(changePassword.currentPassword, user.hashedPassword);

    console.log('Hello');
    if (!isValid) {
        throw new Unauthorized('Current password is incorrect');
    }
    user.hashedPassword = await bcrypt.hash(changePassword.newPassword, ROUNDS_NUMBER);

    await userRepo.update(user.id, user);
}
