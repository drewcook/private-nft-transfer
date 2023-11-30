import connectMongo from '@/lib/mongoClient'
import { TokenTransfer } from '@/models/TokenTransfer.model'
import { getErrorResponse, getSuccessResponse } from '@/utils/serverResponses'

// GET /api
export async function GET(req: Request) {
	try {
		// Get params
		const { searchParams } = new URL(req.url)
		const contractAddress = searchParams.get('contractAddress')
		const tokenId = searchParams.get('tokenId')

		// Connect to MongoDB
		await connectMongo()

		// Find the token transfer
		const record = await TokenTransfer.findOne({ collectionAddress: contractAddress, tokenId })

		// Return success
		return getSuccessResponse(record)
	} catch (error: any) {
		return getErrorResponse(500, error.message, error)
	}
}

// POST /api
export async function POST(req: Request) {
	try {
		// Get params
		const { collectionAddress, tokenId, sellerAddress, approvedBuyerAddress, signature } = await req.json()
		// Connect to MongoDB
		await connectMongo()

		// Generate the URL
		const generatedBuyUrl = `http://localhost:3000/${approvedBuyerAddress}/${collectionAddress}/${tokenId}`

		// Create new model
		const model = new TokenTransfer({
			collectionAddress,
			tokenId,
			sellerAddress,
			approvedBuyerAddress,
			transferred: false,
			generatedBuyUrl,
			signature,
		})
		const resp = await model.save()
		// Return a 201 with the generated url
		return getSuccessResponse(generatedBuyUrl, 201)
	} catch (error: any) {
		return getErrorResponse(500, error.message, error)
	}
}
