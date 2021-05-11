import { log } from '@graphprotocol/graph-ts';
import { Create } from '../types/Lottery/Lottery';
import { Lottery } from '../types/schema';

export function handleCreate(event: Create): void {
  log.debug('Parsing Create for txHash {}', [
    event.transaction.hash.toHexString(),
  ]);
  let txHash = event.transaction.hash;
  let lottery = Lottery.load(txHash.toHexString());
  if (lottery == null) {
    lottery = new Lottery(txHash.toHexString());
  }
  lottery.member = event.params.member;
  lottery.lotteryID = event.params.lotteryID;
  lottery.amount = event.params.amount;
  lottery.txHash = txHash;
  lottery.timestamp = event.block.timestamp;
  lottery.save();
}
