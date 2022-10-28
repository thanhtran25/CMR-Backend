import { BadRequest } from 'http-errors';

function validate<T>(object: any, schema: any): T | any {
    const { error, value } = schema.validate(object, { abortEarly: false });
    if (error) {
        const errorDetails = error.details.map((detail: any) => {
            const { message, path } = detail;
            const [field] = [...path];
            return { message, field };
        })
        throw new BadRequest(errorDetails);
    }
    return value;
}

export { validate }