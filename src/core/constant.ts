export const ROUNDS_NUMBER = 10;

export const PAGINATION = {
    DEFAULT_PAGE_NUMBER: parseInt(process.env.PAGE_NUMBER || '1', 10),
    DEFAULT_PAGE_SIZE: parseInt(process.env.PAGE_SIZE || '2', 10),
    MAX_PAGE_SIZE: 50,
};

export const ANONYMOUS_USER = 'Anonymous'