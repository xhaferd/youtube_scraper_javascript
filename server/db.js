const typeorm = require('typeorm');

class Creator {
    constructor(id, name, img, ytURL) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.ytURL = ytURL;
    }
}

const EntitySchema = require("typeorm").EntitySchema;

const CreatorSchema = new EntitySchema({
    name: "Creator",
    target: Creator,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "text",
        },
        img: {
            type: "text",
        },
        ytURL: {
            type: "text",
        },
    }
});

async function getConnection() {
    return await typeorm.createConnection({
        type: process.env.DB_CONNECTION,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        logging: false,
        entities: [CreatorSchema]
    });
}

async function getAllCreators() {
    const connection = await getConnection();
    const creatorRepo = connection.getRepository(Creator);
    const creators = await creatorRepo.find();
    connection.close();

    return creators;
}

async function insertCreator(name, img, ytURL) {
    const connection = await getConnection();

    // Create
    const creator = new Creator();
    creator.name = name;
    creator.img = img;
    creator.ytURL = ytURL;

    // Save
    const creatorRepo = connection.getRepository(Creator);
    const res = await creatorRepo.save(creator);
    console.log('saved', res);

    // Return new list
    const allCreators = await creatorRepo.find();

    connection.close();
    return allCreators;
}

module.exports = {
    getAllCreators,
    insertCreator
}