import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true
            }
        });

        if (!user) return res.status(404).json({ error: "User Not Found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Invalid Credentials" });

        const token = signToken(user.id, user.email);

        // Remove password from user object before sending
        const { password: _, ...userWithoutPassword } = user;
        
        return res.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Error Logging in" });
    }
}