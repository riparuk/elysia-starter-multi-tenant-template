import { db } from "../lib/database";

const CHECKS = {
    DATABASE: false,
}

const checkDatabaseConnection = async () => {
    try {
        await db.execute(`SELECT 1`);
        CHECKS.DATABASE = true;
    } catch (error) {
        CHECKS.DATABASE = false;
    }
}

export const healthCheck = async () => {
    await checkDatabaseConnection();
    return {
        status: "ok",
        message: "Elysia Backend is running",
        checks: CHECKS
    }
}