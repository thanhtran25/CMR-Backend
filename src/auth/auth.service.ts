import { BadRequest, Unauthorized } from 'http-errors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as qs from 'qs';
import * as crypto from 'crypto';
import axios from 'axios';
import { AppDataSource } from '../core/database';
import { User } from '../users/users.entity';
import { Token } from './token.entity';
import { ROUNDS_NUMBER } from '../core/constant'
import { ForgotPasswordDTO, ResetPasswordDTO, SignupDTO } from './auth.dto';
import { MoreThan } from 'typeorm';
import { randomBytes } from 'crypto';
import { sendEmail } from '../core/utils/send-email.util';
import { GoogleUser } from 'src/core/interfaces/google-user.interface';

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

export function getGoogleAuthURL() {
    //rootUrl constant
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${process.env.LOGIN_GOOGLE_REDIRECT_URL}`,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ].join(" "),
    }
    const loginUrl = `${rootUrl}?${qs.stringify(options)}`;
    return loginUrl;
}


export async function getTokens(code: string) {
    const getGoogleTokenUrl = "https://oauth2.googleapis.com/token";
    const options = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.LOGIN_GOOGLE_REDIRECT_URL}`,
        grant_type: "authorization_code"
    };

    const response = await axios.post(getGoogleTokenUrl, qs.stringify(options), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })

    return response.data
}


export async function getGoogleUser(code: string) {
    let googleUser: GoogleUser;

    try {
        const { access_token: googleAccessToken, id_token: idToken } = await getTokens(code);

        //getGoogleUserUrl constant
        const getGoogleUserUrl = "https://www.googleapis.com/oauth2/v1/userinfo";

        const options = {
            alt: 'json',
            access_token: googleAccessToken,
        }

        const response = await axios.get(`${getGoogleUserUrl}?${qs.stringify(options)}`, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        })

        googleUser = response.data
    } catch (error) {
        throw new Unauthorized("Login failed, code invalid");
    }


    let user = await userRepo.findOne({
        where: {
            email: googleUser.email,
        }
    })

    let hasPassword = true;
    // Create local user if not existed
    if (!user) {
        hasPassword = false;

        user = new User({
            email: googleUser.email,
            fullname: googleUser.name,
            hashedPassword: '',
        })

        await userRepo.save(user);
    }


    const payload = { id: user.id, email: user.email, role: user.role }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION });

    const { hashedPassword, ...information } = user;

    return { information, accessToken, hasPassword };
}