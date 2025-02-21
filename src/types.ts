export interface Transaction {
  account: string;
  account_friendly: string;
  hash: string;
  lt: number;
  now: number;
  total_fees: number;
  in_msg: {
    hash: string;
    source: string;
    source_friendly: string;
    destination: string;
    destination_friendly: string;
    value: string;
    fwd_fee: string;
  };
}