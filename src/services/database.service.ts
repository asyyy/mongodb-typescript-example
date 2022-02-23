// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
export const collections: { products?: mongoDB.Collection } = {}

// Initialize Connection
export async function connectToDatabase () {

    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    await db.command({
        "collMod": process.env.PRODUCTS_COLLECTION_NAME,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "price", "category"],
                additionalProperties: false,
                properties: {
                    _id: {},
                    name: {
                        bsonType: "string",
                        description: "'name' is required and is a string"
                    },
                    price: {
                        bsonType: "number",
                        description: "'price' is required and is a number"
                    }
                }
            }
         }
    });
   
    const productsCollection: mongoDB.Collection = db.collection(process.env.PRODUCTS_COLLECTION_NAME);
 
    collections.products = productsCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${productsCollection.collectionName}`);
 }