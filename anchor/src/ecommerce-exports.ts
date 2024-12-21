// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import EcommerceIDL from '../target/idl/ecommerce.json'
import type { Ecommerce } from '../target/types/ecommerce'

// Re-export the generated IDL and type
export { Ecommerce, EcommerceIDL }

// The programId is imported from the program IDL.
export const ECOMMERCE_PROGRAM_ID = new PublicKey(EcommerceIDL.address)

// This is a helper function to get the Ecommerce Anchor program.
export function getEcommerceProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...EcommerceIDL, address: address ? address.toBase58() : EcommerceIDL.address } as Ecommerce, provider)
}

// This is a helper function to get the program ID for the Ecommerce program depending on the cluster.
export function getEcommerceProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Ecommerce program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return ECOMMERCE_PROGRAM_ID
  }
}
