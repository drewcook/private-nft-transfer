'use client'
import { Button, Grid, Paper, Typography } from '@mui/material'
import { signTypedData } from '@wagmi/core'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useState } from 'react'
import { sepolia, useAccount } from 'wagmi'

import { useContract } from '@/components/ContractProvider'

const styles = {
	paper: {
		p: 4,
		textAlign: 'center',
	},
	button: {
		display: 'block',
		my: 2,
		mx: 'auto',
	},
}

const Dashboard: React.FC = () => {
	const TOKEN_ID = 1
	const APPROVED_BUYER = '0x847F115314b635F58A53471768D14E67e587cb56'
	// State
	const [nftName, setNftName] = useState<string>('')
	const [tokenUri, setTokenUri] = useState<string>('')

	// Hooks
	const { nft, executeContractRead, executeContractWrite } = useContract()
	const { isConnected, address } = useAccount()
	const { open } = useWeb3Modal()

	// Handlers
	const handleSell = async () => {
		try {
			if (!isConnected) return open()

			// 1. Construct typed data
			// All properties on a domain are optional
			const domain = {
				name: 'PrivateTransfer',
				version: '1',
				chainId: sepolia.id,
				verifyingContract: nft.address,
			} as const
			const types = {
				Transfer: [
					{ name: 'tokenId', type: 'uint256' },
					{ name: 'receiver', type: 'address' },
				],
			} as const
			const message = {
				tokenId: BigInt(TOKEN_ID),
				receiver: APPROVED_BUYER,
			} as const

			// 2. Sign typed data
			const signature = await signTypedData({
				domain,
				message,
				primaryType: 'Transfer',
				types,
			})

			// 3. Approve contract as operator for tokenID 1
			const [result, hash] = await executeContractWrite({
				address: nft.address,
				abi: nft.abi,
				functionName: 'approve',
				args: [APPROVED_BUYER, TOKEN_ID],
			})
			console.log({ result, hash })

			// 4. Store a new mongo record
			const res = await fetch('http://localhost:3000/api/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					collectionAddress: nft.address,
					tokenId: TOKEN_ID,
					sellerAddress: address,
					approvedBuyerAddress: APPROVED_BUYER,
					signature,
				}),
			})
			const { data } = await res.json()
			console.log({ data })
		} catch (e) {
			console.error(e)
		}
	}

	const handleGetName = async () => {
		try {
			setNftName('')
			const result = (await executeContractRead({ address: nft.address, abi: nft.abi, functionName: 'name' })) as string
			setNftName(result)
		} catch (e) {
			console.error(e)
		}
	}

	const handleGetTokenURI = async (tokenId: number) => {
		try {
			setTokenUri('')
			const result = (await executeContractRead({
				address: nft.address,
				abi: nft.abi,
				functionName: 'tokenURI',
				args: [tokenId],
			})) as string
			setTokenUri(result)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<>
			<Grid container spacing={4}>
				<Grid item xs={12} md={6}>
					<Paper sx={styles.paper}>
						<Typography variant="h4" gutterBottom>
							Your Dashboard
						</Typography>
						<Button onClick={handleSell} variant="outlined" sx={styles.button}>
							Sell NFT
						</Button>
						{nft.address && (
							<>
								<Button onClick={handleGetName} variant="outlined" sx={styles.button}>
									Get NFT Name
								</Button>
								<Button onClick={() => handleGetTokenURI(1)} variant="outlined" sx={styles.button}>
									Get TokenURI
								</Button>
							</>
						)}
					</Paper>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper sx={styles.paper}>
						<Typography variant="h4" gutterBottom>
							More Information
						</Typography>
						<Typography gutterBottom>NFT Name: {nftName || 'n/a'}</Typography>
						<Typography gutterBottom>TokenURI: {tokenUri || 'n/a'}</Typography>
					</Paper>
				</Grid>
			</Grid>
		</>
	)
}

export default Dashboard
