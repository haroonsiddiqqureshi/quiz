import { connectToMongoDB } from "../../../lib/mongoDB";
import { NextResponse } from "next/server";
import Expense from "../../../models/expanse";

export async function GET() {
    await connectToMongoDB();
    const expanse = await Expense.find();
    return NextResponse.json(expanse, { status: 200 });
}

export async function POST(req) {
    const { amount, date, type, note } = await req.json();
    await connectToMongoDB();
    await Todo.create({
        amount: amount,
        date: date,
        type: type,
        note: note,
    });
    return NextResponse.json({ message: "Ledger Created" }, { status: 200 });
}