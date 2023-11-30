import mongoose, { Document } from 'mongoose'

export type TokenTransferDoc = Document & {
	collectionAddress: string
	tokenId: number
	sellerAddress: string
	approvedBuyerAddress: string
	transferred: boolean
	generatedBuyUrl: string
	signature: string
}

const schema = new mongoose.Schema<TokenTransferDoc>(
	{
		collectionAddress: {
			type: String,
			required: true,
		},
		tokenId: {
			type: Number,
			required: true,
		},
		sellerAddress: {
			type: String,
			required: true,
		},
		approvedBuyerAddress: {
			type: String,
			required: true,
		},
		signature: {
			type: String,
			required: true,
		},
		transferred: {
			type: Boolean,
			required: true,
		},
		generatedBuyUrl: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
)

export const TokenTransfer = mongoose.models.tokenTransfer || mongoose.model<TokenTransferDoc>('tokenTransfer', schema)
