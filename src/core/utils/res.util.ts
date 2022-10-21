import { HttpError, InternalServerError } from 'http-errors';

function handleError(res: any, error: any) {
    if (error instanceof HttpError) {
        if (error instanceof InternalServerError) {
            console.log(error);
        }
        return res.status(error.statusCode).send({ error: error.message });
    }
    console.log(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ error: 'This object existed' });
    }
    return res.status(500).send({ error: 'Internal Server Error' });
}

export {
    handleError
};