import { NextResponse } from "next/server";
import dbConnect from "app/lib/dbconnect";
import Task from "app/models/Task";

// ✅ GET: Fetch all tasks
export async function GET() {
  await dbConnect();
  const tasks = await Task.find().sort({ createdAt: -1 }); // Latest first
  return NextResponse.json(tasks);
}

// ✅ POST: Create a new task
export async function POST(req) {
  await dbConnect();
  const { text } = await req.json();
  const newTask = await Task.create({ text });
  return NextResponse.json(newTask);
}

// ✅ PUT: Update a task
export async function PUT(req) {
  await dbConnect();
  const { id, text, completed } = await req.json();
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { text, completed },
    { new: true }
  );
  return NextResponse.json(updatedTask);
}

// ✅ DELETE: Remove a task
export async function DELETE(req) {
  await dbConnect();
  const { id } = await req.json();
  await Task.findByIdAndDelete(id);
  return NextResponse.json({ message: "Task deleted" });
}
