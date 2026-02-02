import Todo from "../models/Todo.model.js";
import xlsx from "xlsx";

export const exportTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });

    const formatted = todos.map(todo => ({
      Title: todo.title,
      Status: todo.completed ? "Completed" : "Pending"
    }));

    const worksheet = xlsx.utils.json_to_sheet(formatted);
    const workbook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workbook, worksheet, "Todos");

    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=todos.xlsx"
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
};
