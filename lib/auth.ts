import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        // ✅ PASS CURRENCY TO THE USER OBJECT
        return { 
          id: user._id.toString(), 
          email: user.email, 
          username: user.username,
          currency: user.currency || "USD" // Default to USD if not set
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  
  // ✅ ADD CALLBACKS TO PASS DATA TO CLIENT
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.currency = user.currency;
        token.username = user.username;
      }
      // Allow client to update session without re-logging in
      if (trigger === "update" && session) {
        token.currency = session.currency;
        token.username = session.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).currency = token.currency;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
};