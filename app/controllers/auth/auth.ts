import { Request, Response, NextFunction } from "express";

export const login = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
        next(error);
    }
};