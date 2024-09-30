import { connectToMongoDB } from "../../../../lib/mongoDB";
import { NextResponse } from "next/server";
import Todo from "../../../../models/expanse";

export async function GET(req, { params }) {
  const { id } = params;
  await connectToMongoDB();
  const expanse = await Expense.findById(id);
  return NextResponse.json({ expanse }, { status: 200 });
}
export async function PATCH(req, { params }) {
  const { id } = params;
  const { completed } = await req.json();
  await connectToMongoDB();
  const expanse = await Expense.findByIdAndUpdate(id, { completed });
  return NextResponse.json({ message: "Ledger Update" }, { status: 200 });
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { amount, date, type, note } = await req.json();
  await connectToMongoDB();
  const expanse = await Expense.findByIdAndUpdate(id, {
    amount,
    date,
    type,
    note,
  });
  return NextResponse.json({ message: "Ledger Update" }, { status: 200 });
}

export async function DELETE(req, { params }) {
  const { id } = params;
  await connectToMongoDB();
  const expanse = await Expense.findByIdAndDelete(id);
  return NextResponse.json({ message: "Ledger Delete" }, { status: 200 });
}