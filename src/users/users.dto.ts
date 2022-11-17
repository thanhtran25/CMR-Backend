import { Gender, Roles } from "../core/enum";

export class CreateUserDTO {
    email: string;
    password: string;
    fullname: string;
    birthday: Date;
    gender: Gender;
    address: string;
    numberPhone: string;
    role: Roles;
}

export class UpdateUserDTO {
    id: number;
    email: string;
    fullname: string;
    birthday: Date;
    gender: Gender;
    address: string;
    numberPhone: string;
}

export class ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}

export class GoogleChangePasswordDTO {
    newPassword: string;
}

export class ChangePositionDTO {
    id: number
    role: Roles;
}