import { Elysia, t } from 'elysia'

import { ProductService } from './service'
import { ProductModel } from './model'
import {
	formatResponse,
	FormatResponseSchema
} from '../../core/format-response'
import { buildPaginationMeta } from '../../core/pagination'
import { authMiddleware } from '../../middleware/auth-middleware'

export const productHandler = new Elysia({
	prefix: '/products',
	tags: ['Product']
})
	// Auth middleware
	.use(authMiddleware)

	// GET /products — list with pagination
	.get(
		'/',
		async ({ query, path, activeOrganizationId }) => {
			const { data, totalItems, pagination } =
				await ProductService.getAll(query, activeOrganizationId)
			return formatResponse({
				path,
				data,
				meta: buildPaginationMeta(pagination, totalItems)
			})
		},
		{
			requireOrganization: true,
			query: ProductModel.ProductQuery,
			response: FormatResponseSchema(
				t.Array(ProductModel.ProductWithUserResponse)
			)
		}
	)

	// GET /products/:id — single product
	.get(
		'/:id',
		async ({ params: { id }, path, activeOrganizationId }) => {
			const data = await ProductService.getById(id, activeOrganizationId)
			return formatResponse({ path, data })
		},
		{
			requireOrganization: true,
			params: t.Object({ id: t.String() }),
			response: FormatResponseSchema(ProductModel.ProductWithUserResponse)
		}
	)

	// GET /products/my-products — list with pagination
	.get(
		'/my-products',
		async ({ query, path, user, activeOrganizationId }) => {
			const { data, totalItems, pagination } =
				await ProductService.getAllMyProducts(
					query,
					user.id,
					activeOrganizationId
				)
			return formatResponse({
				path,
				data,
				meta: buildPaginationMeta(pagination, totalItems)
			})
		},
		{
			requireAuth: true, // need auth role
			requireOrganization: true,
			query: ProductModel.ProductQuery,
			response: FormatResponseSchema(
				t.Array(ProductModel.ProductResponse)
			)
		}
	)

	// POST /products — create
	.post(
		'/',
		async ({ body, path, user, activeOrganizationId }) => {
			const data = await ProductService.create(
				body,
				user.id,
				activeOrganizationId
			)
			return formatResponse({
				path,
				data,
				status: 201,
				message: 'Product created'
			})
		},
		{
			requireAuth: true, // need auth role
			requireOrganization: true,
			body: ProductModel.ProductInputCreate,
			response: FormatResponseSchema(ProductModel.ProductResponse)
		}
	)

	// PATCH /products/:id — update
	.patch(
		'/:id',
		async ({ params: { id }, body, path, activeOrganizationId }) => {
			const data = await ProductService.update(
				id,
				body,
				activeOrganizationId
			)
			return formatResponse({ path, data, message: 'Product updated' })
		},
		{
			requireAuth: true, // need auth role
			requireOrganization: true,
			params: t.Object({ id: t.String() }),
			body: ProductModel.ProductInputUpdate,
			response: FormatResponseSchema(ProductModel.ProductResponse)
		}
	)

	// DELETE /products/:id — delete
	.delete(
		'/:id',
		async ({ params: { id }, path, activeOrganizationId }) => {
			const data = await ProductService.delete(id, activeOrganizationId)
			return formatResponse({ path, data, message: 'Product deleted' })
		},
		{
			requireAuth: true, // need auth role
			requireOrganization: true,
			params: t.Object({ id: t.String() }),
			response: FormatResponseSchema(ProductModel.ProductResponse)
		}
	)
