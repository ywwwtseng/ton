import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Address } from '@prisma/client';
import { get_transfer_ton_transactions } from '@/actions';
import { get_time_slot } from '@/utils';

export async function GET() {
  const headersList = await headers();
  const authorization = headersList.get('Authorization');

  if (
    process.env.NODE_ENV === 'production'
    && authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json('Unauthorized', { status: 401 });
  }

  const last_check_record = await prisma.lastCheckRecord.findUnique({
    where: {
      id: 'last-check-record'
    }
  });

  const time_slot = get_time_slot(Date.now() - 15000);

  if (last_check_record?.last_checked_at === time_slot.start) {
    return NextResponse.json({ ok: true });
  }

  await prisma.lastCheckRecord.upsert({
    where: {
      id: 'last-check-record'
    },
    create: {
      id: 'last-check-record',
      last_checked_at: time_slot.start,
    },
    update: {
      last_checked_at: time_slot.start,
    },
  });

  const transfer_ton_transactions = await get_transfer_ton_transactions(time_slot.start, time_slot.end);
  const transfer_ton_transaction_addresses = [
    ...new Set(transfer_ton_transactions.map(transaction => transaction.in_msg.destination_friendly))
  ];

  const result = await prisma.address.findMany({
    where: {
      address: { in: transfer_ton_transaction_addresses }, // 查詢符合的地址
    },
    select: { address: true }, // 只取出 address 欄位
  }) as Address[];

  const addresses = result.map(({ address }) => address);

  console.log(addresses, 'addresses');

  return NextResponse.json({ ok: true });
}
