// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Product from "../models/products";

// Global Config
export const productsRouter = express.Router();

productsRouter.use(express.json());

// GET

productsRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const products = (await collections.products.find({}).toArray()) as unknown  as Product[];

        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

productsRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
    
        const query = { _id: new ObjectId(id) };
        const products = (await collections.products.findOne(query)) as unknown as Product;

        if (products) {
            res.status(200).send(products);
        }else{
            res.status(404).send(`2 : Unable to find matching document with id: ${req.params.id}`);
        }

    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

// POST

productsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newGame = req.body as Product;
        const result = await collections.products.insertOne(newGame);

        result
            ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

// PUT

productsRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedProduct: Product = req.body as Product;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.products.updateOne(query, { $set: updatedProduct });

        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// DELETE

productsRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.products.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});