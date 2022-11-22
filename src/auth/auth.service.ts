import { BadRequest, Unauthorized } from 'http-errors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as qs from 'qs';
import * as crypto from 'crypto';
import * as otpGenerator from 'otp-generator';
import axios from 'axios';
import { AppDataSource } from '../core/database';
import { User } from '../users/users.entity';
import { Token } from './token.entity';
import { ROUNDS_NUMBER } from '../core/constant'
import { ConfirmAccountDTO, ForgotPasswordDTO, ResendOTPDTO, ResetPasswordDTO, SignupDTO } from './auth.dto';
import { MoreThan } from 'typeorm';
import { randomBytes } from 'crypto';
import { sendEmail } from '../core/utils/send-email.util';
import { GoogleUser } from '../core/interfaces/google-user.interface';
import { TokenType } from '../core/enum';

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

    const newOTP = generateOTP();
    const otpLink = `${process.env.WEB_OTP_URL}/${signupDTO.email}`;

    const verifyToken = new Token({
        user: newUser,
        token: crypto.createHash('sha256').update(newOTP).digest('hex'),
        expiredAt: new Date(Date.now() + +process.env.EXPIRED_VERIFY_ACCOUNT_TOKEN),
        type: TokenType.SIGNUP
    });
    await tokenRepo.save(verifyToken);
    sendEmail({
        email: newUser.email,
        subject: "Goldduck Camera - Confirm Account",
        template: 'send-otp',
        context: { newOTP, otpLink }
    }).catch(error => console.log(error));
    return newUser;
}

export async function signin(email: string, password: string) {
    const user = await userRepo.findOne({
        where: {
            email: email,
            verify: true
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
        throw new BadRequest('User with given email does not exist');
    }

    let token = await tokenRepo.findOne({
        where: {
            user: user,
            expiredAt: MoreThan(new Date())
        }
    })

    if (!token) {
        token = new Token({
            user: user,
            token: randomBytes(32).toString("hex"),
            expiredAt: new Date(Date.now() + +process.env.EXPIRED_RESET_PASSWORD_TOKEN),
            type: TokenType.FORGOT_PASSWORD
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
            expiredAt: MoreThan(new Date()),
            type: TokenType.FORGOT_PASSWORD
        }
    })

    if (!token) {
        throw new Unauthorized('Invalid link or expired');
    }

    user.hashedPassword = await bcrypt.hash(resetPasswordDTO.password, ROUNDS_NUMBER);
    await userRepo.save(user);
    await tokenRepo.delete(token.id);
}

export async function confirmAccount(confirmAccountDTO: ConfirmAccountDTO) {
    const user = await userRepo.findOne({
        where: {
            email: confirmAccountDTO.email
        }
    });

    if (!user) {
        throw new BadRequest('Invalid link or expired');
    }

    const otpHash = crypto.createHash('sha256').update(confirmAccountDTO.otp.toString()).digest('hex');

    const confirmToken = await tokenRepo.findOne({
        where: {
            userId: user.id,
            token: otpHash,
            expiredAt: MoreThan(new Date()),
            type: TokenType.SIGNUP
        }
    })

    if (!confirmToken) {
        throw new BadRequest('Invalid link or expired');
    }

    user.verify = true;
    await userRepo.save(user);
    await tokenRepo.delete(confirmToken.id);
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
        },
        select: ['address', 'birthday', 'createdAt', 'deletedAt', 'updatedAt', 'email', 'fullname', 'gender', 'hashedPassword', 'id', 'numberPhone', 'role']
    })

    let hasPassword = true;
    // Create local user if not existed
    if (!user) {
        user = new User({
            email: googleUser.email,
            fullname: googleUser.name,
            hashedPassword: '',
        })

        await userRepo.save(user);
    }

    if (!user.hashedPassword) {
        hasPassword = false;
    }

    const payload = { id: user.id, email: user.email, role: user.role }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION });

    const { hashedPassword, ...information } = user;

    return { information, accessToken, hasPassword };
}

function generateOTP() {
    return otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });
}

export async function resendOTP(resendDTO: ResendOTPDTO) {
    const user = await userRepo.findOneBy({
        email: resendDTO.email
    });
    if (!user) {
        throw new BadRequest('User with given email does not exist');
    }

    const newOTP = generateOTP();

    const verifyToken = new Token({
        user: user,
        token: crypto.createHash('sha256').update(newOTP).digest('hex'),
        expiredAt: new Date(Date.now() + +process.env.EXPIRED_VERIFY_ACCOUNT_TOKEN),
        type: TokenType.SIGNUP
    });

    let currentToken = await tokenRepo.findOne({
        where: {
            userId: user.id,
            expiredAt: MoreThan(new Date()),
            type: TokenType.SIGNUP
        }
    });

    if (!currentToken) {
        throw new BadRequest('Verified account');
    }

    await tokenRepo.delete(currentToken.id);

    await tokenRepo.save(verifyToken);
    sendEmail({
        email: user.email,
        subject: "Goldduck Camera - Confirm Account",
        template: 'send-otp',
        context: { newOTP }
    }).catch(error => console.log(error));
}