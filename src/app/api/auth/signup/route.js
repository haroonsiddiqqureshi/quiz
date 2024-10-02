import { NextResponse } from "next/server";
import { connectToMongoDB } from "../../../lib/mongoDB";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 12);

        await connectToMongoDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const user = new User({ email, password: hashedPassword });
        user.save();

        return NextResponse.json({ message: "Register Successfully" }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: err }, { status: 500 });
    }
}