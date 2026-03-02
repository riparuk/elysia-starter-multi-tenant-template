// Service handles business logic, decoupled from Elysia controller
import { and, eq, ilike, sql, count } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "../../lib/database";
import { PaginatedResult, normalizePagination } from "../../core/pagination";
import { product } from "./schema";
import { ProductModel } from "./model";
import { AppError } from "../../core/error";

// Abstract class as it carries no instance state
export abstract class ProductService {

    private static async checkProductOwnership(productId: string, userId: string): Promise<void> {
        const row = await db.query.product.findFirst({
            where: eq(product.id, productId),
        });

        if (!row) {
            throw new AppError("Product not found", "NOT_FOUND");
        }

        if (row.userId !== userId) {
            throw new AppError("You are not authorized to perform this action", "UNAUTHORIZED");
        }
    }

    static async getAll(
        query?: ProductModel.ProductQuery,
    ): Promise<PaginatedResult<ProductModel.ProductWithUserResponse>> {
        const pagination = normalizePagination(query);

        const where = query?.q
            ? ilike(product.name, `%${query.q}%`)
            : undefined;

        const [data, countResult] = await Promise.all([
            db.query.product.findMany({
                where: where,
                limit: pagination.take,
                offset: pagination.skip,
                orderBy: product.createdAt,
                // With Include
                with: {
                    user: true
                }
            }),
            db
                .select({ count: count() })
                .from(product)
                .where(where),
        ]);

        return { data, totalItems: countResult[0]?.count ?? 0, pagination };
    }

    static async getById(id: string): Promise<ProductModel.ProductWithUserResponse> {
        const row = await db.query.product.findFirst({
            where: eq(product.id, id),
            // With Include
            with: {
                user: true
            }
        });

        if (!row) {
            throw new AppError("Product not found", "NOT_FOUND");
        }

        return row;
    }

    static async getAllMyProducts(
        query?: ProductModel.ProductQuery,
        userId?: string,
    ): Promise<PaginatedResult<ProductModel.ProductResponse>> {
        const pagination = normalizePagination(query);

        const where = and(
            userId ? eq(product.userId, userId) : undefined,
            query?.q ? ilike(product.name, `%${query.q}%`) : undefined
        );

        const [data, countResult] = await Promise.all([
            db.query.product.findMany({
                where: where,
                limit: pagination.take,
                offset: pagination.skip,
                orderBy: product.createdAt,
            }),
            db
                .select({ count: count() })
                .from(product)
                .where(where),
        ]);

        return { data, totalItems: countResult[0]?.count ?? 0, pagination };
    }

    static async create(data: ProductModel.ProductInputCreate, userId: string): Promise<ProductModel.ProductResponse> {
        const [row] = await db
            .insert(product)
            .values({
                id: nanoid(),
                userId,
                name: data.name,
                description: data.description ?? null,
                price: String(data.price),
                stock: data.stock ?? 0,
            })
            .returning();

        return row;
    }

    static async update(id: string, data: ProductModel.ProductInputUpdate, userId: string): Promise<ProductModel.ProductResponse> {
        // Check product ownership
        await this.checkProductOwnership(id, userId);

        const [row] = await db
            .update(product)
            .set({
                ...(data.name !== undefined && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.price !== undefined && { price: String(data.price) }),
                ...(data.stock !== undefined && { stock: data.stock }),
            })
            .where(eq(product.id, id))
            .returning();

        return row;
    }

    static async delete(id: string, userId: string): Promise<ProductModel.ProductResponse> {
        // Check product ownership
        await this.checkProductOwnership(id, userId);

        const [row] = await db
            .delete(product)
            .where(eq(product.id, id))
            .returning();

        return row;
    }
}
