'use client'

import { getEcommerceProgram, getEcommerceProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useEcommerceProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getEcommerceProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getEcommerceProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['ecommerce', 'all', { cluster }],
    queryFn: () => program.account.ecommerce.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['ecommerce', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ ecommerce: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useEcommerceProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useEcommerceProgram()

  const accountQuery = useQuery({
    queryKey: ['ecommerce', 'fetch', { cluster, account }],
    queryFn: () => program.account.ecommerce.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['ecommerce', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ ecommerce: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['ecommerce', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ ecommerce: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['ecommerce', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ ecommerce: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['ecommerce', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ ecommerce: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}