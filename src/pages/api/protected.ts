import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../lib/auth";

export function protectedRoute(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return null;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: "Invalid or expired token" });
    return null;
  }

  return decoded; // Returns { id, email, role }
}
