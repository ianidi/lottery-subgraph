import { log } from '@graphprotocol/graph-ts';
import { Create } from '../types/Lottery/Lottery';
import { Execution } from '../types/schema';

export function handleCreate(event: Create): void {
  log.debug('Parsing Create for txHash {}', [
    event.transaction.hash.toHexString(),
  ]);
  let txHash = event.transaction.hash;
  let execution = Execution.load(txHash.toHexString());
  if (execution == null) {
    execution = new Execution(txHash.toHexString());
  }
  execution.member = event.params.member;
  execution.lotteryID = event.params.lotteryID;
  execution.amount = event.params.amount;
  execution.txHash = txHash;
  execution.timestamp = event.block.timestamp;
  execution.save();
}
