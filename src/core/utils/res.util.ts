import { HttpError, InternalServerError } from 'http-errors';
import { MulterError } from 'multer';

function handleError(res: any, error: any) {
    if (error instanceof MulterError) {
        if (error.code = 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).send({ error: 'Limit field size' });
        }

        return res.status(400).send({ error: error.message });

    }
    if (error instanceof HttpError) {
        if (error instanceof InternalServerError) {
            console.log(error);
        }
        return res.status(error.statusCode).send({ error: error.message });
    }
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ error: 'This object existed' });
    }
    return res.status(500).send({ error: 'Internal Server Error' });
}

export {
    handleError
};