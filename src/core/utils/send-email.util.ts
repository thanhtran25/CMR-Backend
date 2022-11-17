import * as fs from 'fs/promises';
import * as path from 'path';

import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';

const TEMPLATE_DIR = '../email_templates'

let transporter: nodemailer.Transporter

export async function verify() {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: false,
        ignoreTLS: false,
        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASS
        }
    });

    await transporter.verify()
}


export async function sendEmail({ email, subject, template, context }: { email: string, subject: string, template: string, context?: any }) {
    try {

        if (!transporter) {
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                service: process.env.EMAIL_SERVICE,
                port: parseInt(process.env.EMAIL_PORT, 10),
                secure: false,
                ignoreTLS: false,
                auth: {
                    user: process.env.EMAIL_AUTH_USER,
                    pass: process.env.EMAIL_AUTH_PASS
                }
            });
        }

        const htmlString = await fs.readFile(path.join(__dirname, TEMPLATE_DIR, `${template}.hbs`));
        const compiledTemplate = handlebars.compile(htmlString.toString('utf8'));
        const html = compiledTemplate(context)

        await transporter.sendMail({
            from: process.env.EMAIL_AUTH_USER,
            to: email,
            subject,
            html
        })

        console.log("email sent sucessfully");

    } catch (error) {
        console.log(error, "email not sent");
    }
}