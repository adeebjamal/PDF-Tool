import express, {Express, Request, Response} from "express";

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));

// Adding routes
app.use("/docxtopdf", require("./Routes/Docx_Pdf"));

app.get("/", async(req: Request, res: Response) => {
    try {
        return res.status(200).render("homepage");
    }
    catch(error) {
        console.log(error);
        return res.status(500).render("homepage");
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});