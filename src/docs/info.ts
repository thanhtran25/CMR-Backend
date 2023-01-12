import { servers } from "./server";
import { tags } from "./tags";
const packageJson = require('../../package.json');

export const docs = {
    openapi: "3.0.3",
    info: {
        title: packageJson.name,
        description: "Camera shop API",
        version: "1.0.0",
        contact: {
            name: "Thu Thanh",
            email: "thuthanhtran2610@gmail.com",
            url: "https://www.linkedin.com/in/thanh-tran-thi-thu-6bab93250/",
        },
    },
    servers,
    tags
}