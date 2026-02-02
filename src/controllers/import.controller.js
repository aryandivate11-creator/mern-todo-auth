import Todo from "../models/Todo.model.js"
import { parseExcel } from "../utils/excelParser.js";
import fs from "fs";

export const importTodos = async (req, res) => {
  try {
    console.log("REQ FILE:", req.file);
    console.log("REQ HEADERS:", req.headers["content-type"]);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const titles = parseExcel(req.file.path);
    console.log("TITLES:", titles);

    fs.unlinkSync(req.file.path);

    if (titles.length > 100) {
      return res.status(400).json({ message: "Max 100 rows allowed" });
    }

    const uniqueTitles = [...new Set(titles)];

    const existing = await Todo.find({
      user: req.user.id,
      title: { $in: uniqueTitles }
    });

    const existingTitles = existing.map(t => t.title);

    const newTodos = uniqueTitles
      .filter(t => !existingTitles.includes(t))
      .map(title => ({
        title,
        completed: false,
        user: req.user.id
      }));

    await Todo.insertMany(newTodos);

    res.json({
      added: newTodos.length,
      skipped: existingTitles.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Import failed" });
  }
};
