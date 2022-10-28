import { BadRequest, Unauthorized } from 'http-errors';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../core/database';
import { User } from '../users/users.entity';
import { ROUNDS_NUMBER } from '../core/constant'
import { ChangePositionDTO, ChangePasswordDTO, CreateUserDTO, UpdateUserDTO } from './users.dto';
import { FilterPagination } from '../core/interfaces/filter.interface';
import { buildPagination } from '../core/utils/paginantion.util';

const userRepo = AppDataSource.getRepository(User);

export async function getUsers(filters: FilterPagination) {
    const query = buildPagination(User, filters)
    const users = await userRepo.find(query);
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
        ...updateUserDTO,
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

    user.role = changePosition.role;

    await userRepo.update(user.id, user);
}