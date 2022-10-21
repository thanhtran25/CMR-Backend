import { BadRequest } from 'http-errors';

function validate(object: any, schema: any): any {
    const { error, value } = schema.validate(object, { abortEarly: false });
    if (error) {
        const errorDetails = error.details.map((detail: any) => {
            const { message, path } = detail;
            return { message, path };
        })
        throw new BadRequest(errorDetails);
    }
    return value;
}

export { validate }