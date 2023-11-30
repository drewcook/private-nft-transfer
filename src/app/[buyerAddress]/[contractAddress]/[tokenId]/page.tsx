import { Paper, Typography } from '@mui/material'
import type { Metadata } from 'next'

import BuyNft from '@/components/BuyNft'

export const metadata: Metadata = {
	title: 'Next DApp',
	description:
		'A template for building Ethereum-based dApps using Next.js, Material UI, Wagmi/Viem, and WalletConnect.',
}

const styles = {
	paper: {
		p: 4,
		textAlign: 'center',
	},
}

const DefaultPage = ({ params }) => {
	return (
		<Paper sx={styles.paper}>
			<Typography variant="h4" gutterBottom>
				Buy an NFT Privately
			</Typography>
			<BuyNft contractAddress={params.contractAddress} tokenId={params.tokenId} />
		</Paper>
	)
}

export default DefaultPage
