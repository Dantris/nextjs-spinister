import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        role: "admin" | "user";
    }

    interface Session {
        user: User & DefaultSession["user"];
    }

    interface JWT {
        id: string;
        role: "admin" | "user";
    }
}
