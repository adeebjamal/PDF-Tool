import express, {Express, Request, Response} from "express";

const app: Express = express();

app.set("view engine", "ejs");

app.get("/", async(req: Request, res: Response) => {
    try {
        console.log(req.body);
        return res.status(200).render("homepage");
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({"message" : "Internal server error."});
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});