import { Gender, Roles } from "../core/enum";

export class SignupDTO {
    email: string;
    password: string;
    fullname: string;
    birthday: Date;
    gender: Gender;
    address: string;
    numberPhone: string;
    role: Roles;
}

export class LoginDTO {
    email: string;
    password: string;
}

export class ForgotPasswordDTO {
    email: string;
}

export class ResetPasswordDTO {
    id: number;
    password: string;
    token: string;
}

export class ConfirmAccountDTO {
    email: string;
    otp: number;
}

export class ResendOTPDTO {
    email: string;
}