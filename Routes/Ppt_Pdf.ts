import express, {Express, Router, Request, Response} from "express";
import {convert} from "libreoffice-convert";
import * as fs from "fs";

const router: Router = express.Router();

// Importing functions / middlewares
import {upload} from "../middlewares/upload_middleware";

router.get("/", async(req: Request, res: Response) => {
    try {
        return res.status(200).render("ppttopdf");
    }
    catch(error) {
        console.log(error);
        return res.status(500).render("homepage");
    }
});

router.post("/", upload.single("UploadedFile"), async(req: Request, res: Response) => {
    try {
        if(req.file) {
            console.log(req.file);
            if(req.file.path.slice(-4).toLowerCase() === "pptx" || req.file.path.slice(-3).toLowerCase() === "ppt") {
                const inputPath: string = req.file.path;
                const outputPath: string = req.file.path + ".pdf";
                const toConvert: Buffer = fs.readFileSync(req.file.path);
                convert(toConvert, ".pdf", undefined, async(error, result) => {
                    if(error) {
                        console.log(error);
                        fs.unlinkSync(inputPath);
                        return res.status(500).json({message: "Can't convert the file."});
                    }
                    fs.writeFileSync(outputPath, result);
                    res.status(200).download(outputPath, (error2) => {
                        if(error2) {
                            console.log(error2);
                            fs.unlinkSync(inputPath);
                            fs.unlinkSync(outputPath);
                            return res.status(500).json({message: "Download failed."});
                        }
                        fs.unlinkSync(inputPath);
                        fs.unlinkSync(outputPath);
                    });
                });
            }
            else {
                return res.status(400).json({message: "Upload a PPT / PPTX file."});
            }
        }
        else {
            return res.status(400).json({message: "Select a file and upload."});
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).render("homepage");
    }
})

module.exports = router;