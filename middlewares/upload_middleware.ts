import multer from "multer";
import {Request, Express} from "express"

type multerCallback = (error: any, upload_destination: string) => void;

function dest(req: Request, file: Express.Multer.File, cb: multerCallback): void {
    return cb(null, "./uploads");
}

function fname(req: Request, file: Express.Multer.File, cb: multerCallback): void {
    return cb(null, Date.now() + "-" + file.originalname);
}

const storageOptions = multer.diskStorage({
    destination: dest,
    filename: fname
});

export const upload = multer({storage: storageOptions});