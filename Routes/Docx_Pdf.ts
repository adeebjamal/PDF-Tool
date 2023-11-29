import express, {Express, Router, Request, Response} from "express";
import {convert} from "libreoffice-convert";
import * as fs from "fs";

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
    if(req.file) {
        console.log(req.file);
        if(req.file.path.slice(-4).toLowerCase() === "docx") {
            const inputPath: string = req.file.path;
            const outputPath: string = inputPath + ".pdf";
            const toConvert: Buffer = fs.readFileSync(inputPath);
            convert(toConvert, ".pdf", undefined, async(err, result) => {
                if(err) {
                    console.log(err);
                    fs.unlinkSync(inputPath);
                    return res.status(500).json({message: "Internal server error."});
                }
                fs.writeFileSync(outputPath, result);
                return res.status(200).download(outputPath, (err2) => {
                    if(err2) {
                        console.log(err2);
                        fs.unlinkSync(inputPath);
                        fs.unlinkSync(outputPath);
                        return res.status(500).json({messgae: "Internal server error."});
                    }
                    fs.unlinkSync(inputPath);
                    fs.unlinkSync(outputPath);
                });
            });
        }
        else {
            return res.status(400).json({message: "Selected file is not DOCX"});
        }
    }
    else {
        return res.status(400).json({message: "Please select a file"});
    }
});

module.exports = router;