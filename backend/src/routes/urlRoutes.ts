import { Router, Request, Response } from "express";
import { nanoid } from "nanoid";
import { Url } from "../models/Url.js";

const router = Router();

function validUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

router.get("/", async (_req: Request, res: Response) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch {
    res.status(500).json({ message: "Failed to fetch URLs" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { originalUrl } = req.body as { originalUrl?: string };

    if (!originalUrl || !validUrl(originalUrl)) {
      return res.status(400).json({ message: "Please enter a valid URL." });
    }

    const shortCode = nanoid(8);
    const url = await Url.create({ originalUrl, shortCode });
    return res.status(201).json(url);
  } catch {
    return res.status(500).json({ message: "Failed to create short URL" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Url.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "URL not found" });
    return res.json({ message: "URL deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete URL" });
  }
});

export default router;
