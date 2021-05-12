import { log } from '@graphprotocol/graph-ts';
import { Lottery, Create, Play } from '../types/Lottery/Lottery';
import { ERC20 } from '../types/Lottery/ERC20';
import { CreateLottery, PlayLottery } from '../types/schema';

export function handleCreate(event: Create): void {
  log.debug('Parsing Create for txHash {}', [
    event.transaction.hash.toHexString(),
  ]);
  let txHash = event.transaction.hash;
  let lottery = CreateLottery.load(txHash.toHexString());
  if (lottery == null) {
    lottery = new CreateLottery(txHash.toHexString());
  }

  // Bind the contract to the address that emitted the event
  let contract = Lottery.bind(event.address);

  // Access state variables and functions by calling them
  let currentLottery = contract.lottery(event.params.lotteryID);

  // lottery.status = currentLottery.value1;
  lottery.liquidity = currentLottery.value3;
  lottery.maxBetPercent = currentLottery.value4;
  lottery.duration = currentLottery.value6;
  lottery.formula = currentLottery.value7;
  lottery.collateral = currentLottery.value8;

  lottery.txHash = txHash;
  lottery.member = event.params.member;
  lottery.lotteryID = event.params.lotteryID;
  lottery.amount = event.params.amount;
  lottery.timestamp = event.block.timestamp;

  // Bind the contract to the address that emitted the event
  let tokenInstance = ERC20.bind(currentLottery.value8);

  // Access state variables and functions by calling them
  let name = tokenInstance.try_name();
  let symbol = tokenInstance.try_symbol();
  let decimals = tokenInstance.try_decimals();

  if (!name.reverted) {
    lottery.tokenName = name.value;
  }

  if (!symbol.reverted) {
    lottery.tokenSymbol = symbol.value;
  }

  if (!decimals.reverted) {
    lottery.tokenDecimals = decimals.value;
  }

  lottery.save();
}

export function handlePlay(event: Play): void {
  log.debug('Parsing Play for txHash {}', [
    event.transaction.hash.toHexString(),
  ]);
  let txHash = event.transaction.hash;
  let lottery = PlayLottery.load(txHash.toHexString());
  if (lottery == null) {
    lottery = new PlayLottery(txHash.toHexString());
  }

  // Bind the contract to the address that emitted the event
  let contract = Lottery.bind(event.address);

  // Access state variables and functions by calling them
  let currentLottery = contract.lottery(event.params.lotteryID);

  lottery.formula = currentLottery.value7;
  lottery.collateral = currentLottery.value8;

  lottery.txHash = txHash;
  lottery.member = event.params.member;
  lottery.lotteryID = event.params.lotteryID;
  lottery.amount = event.params.amount;
  lottery.result = event.params.result;
  lottery.timestamp = event.block.timestamp;



  // Bind the contract to the address that emitted the event
  let tokenInstance = ERC20.bind(currentLottery.value8);

  // Access state variables and functions by calling them
  let name = tokenInstance.try_name();
  let symbol = tokenInstance.try_symbol();
  let decimals = tokenInstance.try_decimals();

  if (!name.reverted) {
    lottery.tokenName = name.value;
  }

  if (!symbol.reverted) {
    lottery.tokenSymbol = symbol.value;
  }

  if (!decimals.reverted) {
    lottery.tokenDecimals = decimals.value;
  }

  lottery.save();
}
