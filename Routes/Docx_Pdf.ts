import express, {Express, Router, Request, Response} from "express";

const router: Router = express.Router();

// Importing functions / middlewares
import {upload} from "../middlewares/upload_middleware";

router.get("/", async(req: Request, res: Response) => {
    try {
        return res.status(200).render("docxtopdf");
    }
    catch(error) {
        console.log(error);
        return res.status(500).render("homepage");
    }
});

router.post("/", upload.single("UploadedFile"), async(req: Request, res: Response) => {
    console.log(req.file);
    return res.status(200).json({message: "File Uploaded Successfully."});
});

module.exports = router;