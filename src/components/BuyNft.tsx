'use client'
import { Box, Button } from '@mui/material'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

import { useContract } from './ContractProvider'

type BuyNftProps = {
	contractAddress: string
	tokenId: string
}

const BuyNft = ({ contractAddress, tokenId }: BuyNftProps): JSX.Element => {
	const { nft, executeContractWrite } = useContract()
	const { isConnected, address } = useAccount()
	const { open } = useWeb3Modal()

	const handleBuy = async () => {
		if (!isConnected) return open()

		// 1. Fetch from mongo
		const resp = await fetch(
			`${process.env.NEXT_PUBLIC_CLIENT_URL}/api?contractAddress=${contractAddress}&tokenId=${tokenId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
		const { data } = await resp.json()

		// 3. Execute contract write
		const [result, hash] = await executeContractWrite({
			address: nft.address,
			abi: nft.abi,
			functionName: 'buy',
			args: [data.tokenId, address, data.signature],
		})

		console.log({ result, hash })
	}

	return (
		<Box>
			<Button variant="contained" color="primary" onClick={handleBuy}>
				Buy NFT
			</Button>
		</Box>
	)
}

export default BuyNft
