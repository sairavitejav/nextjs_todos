import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/Todo";

//GET all todos
export async function GET() {
    try {
        await connectToDatabase();
        const todos = await Todo.find().sort({createdAt: -1});
        return NextResponse.json(todos);
    }
    catch(error) {
        return NextResponse.json({message: 'Error fetching todos', error}, {status: 500});
    }
}

// POST a new Todo
export async function POST(req: Request) {
    try{
        await connectToDatabase();
        const {title} = await req.json();
        if (!title) {
            return NextResponse.json({message: 'Title is required'}, {status: 400});
        }
        const newTodo = await Todo.create({title});
        return NextResponse.json(newTodo, {status: 201});
    }
    catch(error) {
        return NextResponse.json({message: 'Error creating todo', error}, {status: 500});
    }
}

// Edit an Existing Todo
export async function PATCH(req: Request) {
    try {
        await connectToDatabase();
        const {id, completed} = await req.json();
        const updated = await Todo.findByIdAndUpdate(id, {completed}, {new: true});
        return NextResponse.json(updated)
    }
    catch(error) {
        return NextResponse.json({message: 'Error updating todo', error}, {status: 500});
    }
}

// Delete a Todo
export async function DELETE(req: Request) {
    try {
        await connectToDatabase();
        const {id} = await req.json();
        await Todo.findByIdAndDelete(id);
        return NextResponse.json({message: 'Todo deleted successfully'});
    }
    catch(error) {
        return NextResponse.json({message: 'Error deleting todo', error}, {status: 500});
    }
}