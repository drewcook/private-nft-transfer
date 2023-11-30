import { Abi, Address, getAddress } from 'viem'
import { sepolia } from 'wagmi'

import { simpleNftABI } from '../../abis/SimpleNFT'

export type ContractABIPair = {
	ADDRESS: Address
	ABI: Abi
}

// TODO: Add in contract deployments and their ABIs for each network supported
type ContractDeployments = {
	NFT_COLLECTION: ContractABIPair
}

const SEPOLIA: ContractDeployments = {
	// SimpleNFT: https://sepolia.etherscan.io/address/0x531e468A8b41F76db4Ce2A35e8E4Dd7d4a9CD7c9
	NFT_COLLECTION: {
		ADDRESS: getAddress('0x531e468A8b41F76db4Ce2A35e8E4Dd7d4a9CD7c9', sepolia.id),
		ABI: simpleNftABI,
	},
}

const CONTRACTS = {
	SEPOLIA,
}

export default CONTRACTS
