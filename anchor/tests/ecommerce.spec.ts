import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Ecommerce} from '../target/types/ecommerce'

describe('ecommerce', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Ecommerce as Program<Ecommerce>

  const ecommerceKeypair = Keypair.generate()

  it('Initialize Ecommerce', async () => {
    await program.methods
      .initialize()
      .accounts({
        ecommerce: ecommerceKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([ecommerceKeypair])
      .rpc()

    const currentCount = await program.account.ecommerce.fetch(ecommerceKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Ecommerce', async () => {
    await program.methods.increment().accounts({ ecommerce: ecommerceKeypair.publicKey }).rpc()

    const currentCount = await program.account.ecommerce.fetch(ecommerceKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Ecommerce Again', async () => {
    await program.methods.increment().accounts({ ecommerce: ecommerceKeypair.publicKey }).rpc()

    const currentCount = await program.account.ecommerce.fetch(ecommerceKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Ecommerce', async () => {
    await program.methods.decrement().accounts({ ecommerce: ecommerceKeypair.publicKey }).rpc()

    const currentCount = await program.account.ecommerce.fetch(ecommerceKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set ecommerce value', async () => {
    await program.methods.set(42).accounts({ ecommerce: ecommerceKeypair.publicKey }).rpc()

    const currentCount = await program.account.ecommerce.fetch(ecommerceKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the ecommerce account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        ecommerce: ecommerceKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.ecommerce.fetchNullable(ecommerceKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
