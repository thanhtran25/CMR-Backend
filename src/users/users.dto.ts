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

export class ChangePassword {
    currentPassword: string;
    newPassword: string;
}

export class FilterUser {
    name: string;
    gender: Gender;
    address: string;
}

export class ChangePosition {
    id: number
    role: Roles;
}