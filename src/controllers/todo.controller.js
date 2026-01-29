import Todo from "../models/Todo.model.js";
import { appendTodoRow } from "../utils/googleSheets.js";

export const createTodo = async (req,res) =>{
      try {
        const todo = await Todo.create({
            title: req.body.title,
            user : req.user.id,
        });

        if (req.user.sheetId) {
         await appendTodoRow(req.user.sheetId, todo);
           } 

        res.status(201).json(todo)
      } catch (error) {
        res.status(501).json({
            error:"Failed to create todo !"
        });
      };
};

export const getTodos = async (req,res) =>{ 
     try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit ) || 5 ;
        const search = req.query.search || "";

        const skip = (page - 1) * limit ;

        const query = {
            user : req.user.id,
            title :{ $regex:search ,$options : "i"}
        };

        const todos = await Todo.find(query)
        .skip(skip)
        .limit(limit); 

        const totalTodos = await Todo.countDocuments(query);

        res.status(200).json({
            page,
            limit,
            totalTodos,
            totalpages : Math.ceil(totalTodos / limit),
            todos,
        })
     } catch (error) {
        console.error(error)
        res.status(500).json({
            error:"Unable to fetch todo's !"
        })
     }
};

export const updateTodo = async (req,res) =>{
    try {
        const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id , user : req.user.id},
        req.body,
        { new:true},
    );
    console.log("Todo ID:", req.params.id);
    console.log("User ID:", req.user.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo)
    } catch (error) {
        res.status(500).json({
            error:"Failed to update Todo !"
        });
    };
};

export const deleteTodo = async (req,res) =>{
    try {
         await Todo.findOneAndDelete({
        _id: req.params.id,
         user: req.user.id,
        });

     res.status(200).json({ message: "Todo deleted" });

    } catch (error) {
        res.status(500).json({
            error:"Unable to delete Todo !"
        })
    }
}