import { BadRequest, Unauthorized } from 'http-errors';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../core/database';
import { User } from '../users/users.entity';
import { ROUNDS_NUMBER } from '../core/constant'
import { ChangePositionDTO, ChangePasswordDTO, CreateUserDTO, UpdateUserDTO } from './users.dto';
import { FilterPagination } from '../core/interfaces/filter.interface';
import { buildPagination } from '../core/utils/paginantion.util';
import { IsNull, Not } from 'typeorm';

const userRepo = AppDataSource.getRepository(User);

export async function getUsers(filters: FilterPagination) {
    const query = buildPagination(User, filters)
    const [result, total] = await userRepo.findAndCount(query);
    return { totalPage: Math.ceil(total / filters.limit), users: result };
}

export async function getLockedUsers(filters: FilterPagination) {
    const { where, order, skip, take } = buildPagination(User, filters);
    const [result, total] = await userRepo.findAndCount({
        where: {
            ...where,
            deletedAt: Not(IsNull())
        },
        withDeleted: true,
        order,
        skip,
        take
    });
    return { totalPage: Math.ceil(total / filters.limit), users: result };
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
    await userRepo.update(id, updateUserDTO);

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

export async function changePassword(changePassword: ChangePasswordDTO, email: string) {
    const user = await userRepo.findOne({
        where: {
            email: email
        },
        select: ['hashedPassword', 'id']
    });

    const isValid = await bcrypt.compare(changePassword.currentPassword, user.hashedPassword);

    if (!isValid) {
        throw new Unauthorized('Current password is incorrect');
    }
    user.hashedPassword = await bcrypt.hash(changePassword.newPassword, ROUNDS_NUMBER);

    await userRepo.update(user.id, user);
}

export async function changePosition(changePosition: ChangePositionDTO) {
    const user = await userRepo.findOne({
        where: {
            id: changePosition.id
        }
    });

    if (!user) {
        throw new BadRequest('User not found');
    }

    await userRepo.update(user.id, { role: changePosition.role });
}

export async function recoverUser(id: number) {
    const user = await userRepo.findOne({
        where: {
            id: id
        },
        withDeleted: true
    });

    if (!user) {
        throw new BadRequest('User not found');
    }

    await userRepo.restore(id);
}