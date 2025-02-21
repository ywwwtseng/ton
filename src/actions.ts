'use server';

import { filter_undefined } from '@/utils';
import { Transaction } from '@/types';

export const fetch_transactions = async ({
  limit,
  start_utime,
  end_utime,
  offset,
}: {
  limit: number;
  start_utime?: number;
  end_utime?: number;
  offset?: number;
}) => {
  const res = await fetch('https://mainnet-rpc.tonxapi.com/v2/json-rpc/3eadfde7-6e4e-4dcd-ac8c-776dcd1ec73e', {
    method: 'POST',
    headers: {accept: 'application/json', 'content-type': 'application/json'},
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getTransactions',
      params: filter_undefined({
        start_utime,
        end_utime,
        limit,
        offset: offset || 0,
      }),
    })
  });

  const data = await res.json();

  return data.result || [];
};

export const get_transactions = async (start_utime?: number, end_utime?: number) => {
  const fetch_all_transactions = async (offset = 0, transactions: Transaction[] = []): Promise<Transaction[]> => {
    const new_transactions = await fetch_transactions({ limit: 256, start_utime, end_utime, offset });

    const merged_transactions = [...transactions, ...new_transactions];

    if (new_transactions.length < 256) {
      return merged_transactions;
    }

    return fetch_all_transactions(offset + 256, merged_transactions);
  };

  return fetch_all_transactions();
};

export const get_transfer_ton_transactions = async (start_utime?: number, end_utime?: number) => {
  const transactions = await get_transactions(start_utime, end_utime);
  return transactions.filter(transaction => transaction.in_msg.destination_friendly && transaction.in_msg.value !== '0');
};