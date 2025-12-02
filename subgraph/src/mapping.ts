import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import {
  Staked,
  Withdrawn,
  RewardsClaimed,
  EmergencyWithdrawn,
  RewardRateUpdated,
  StakingInitialized
} from "../generated/StakingContract/StakingContract";
import {
  StakingContract,
  User,
  Stake,
  Withdrawal,
  RewardClaim,
  EmergencyWithdrawal,
  RewardRateUpdate,
  DailyStats,
  GlobalStats
} from "../generated/schema";

// Helper function to get or create a user
function getOrCreateUser(address: Address): User {
  let user = User.load(address.toHexString());
  if (user == null) {
    user = new User(address.toHexString());
    user.stakedAmount = BigInt.fromI32(0);
    user.totalRewardsClaimed = BigInt.fromI32(0);
    user.totalEmergencyWithdrawals = BigInt.fromI32(0);
    user.lastStakeTimestamp = BigInt.fromI32(0);
    user.createdAt = BigInt.fromI32(0);
    user.updatedAt = BigInt.fromI32(0);
  }
  return user;
}

// Helper function to get or create global stats
function getOrCreateGlobalStats(): GlobalStats {
  let stats = GlobalStats.load("global");
  if (stats == null) {
    stats = new GlobalStats("global");
    stats.totalStaked = BigInt.fromI32(0);
    stats.totalUsers = BigInt.fromI32(0);
    stats.totalStakes = BigInt.fromI32(0);
    stats.totalWithdrawals = BigInt.fromI32(0);
    stats.totalRewardsClaimed = BigInt.fromI32(0);
    stats.totalEmergencyWithdrawals = BigInt.fromI32(0);
    stats.currentRewardRate = BigInt.fromI32(0);
    stats.lastUpdated = BigInt.fromI32(0);
  }
  return stats;
}

// Helper function to get or create daily stats
function getOrCreateDailyStats(timestamp: BigInt): DailyStats {
  let dayTimestamp = timestamp.div(BigInt.fromI32(86400)).times(BigInt.fromI32(86400));
  let date = new Date(dayTimestamp.toI32() * 1000);
  let dateString = date.toISOString().split('T')[0];
  
  let stats = DailyStats.load(dateString);
  if (stats == null) {
    stats = new DailyStats(dateString);
    stats.date = dateString;
    stats.totalStaked = BigInt.fromI32(0);
    stats.totalUsers = BigInt.fromI32(0);
    stats.totalStakes = BigInt.fromI32(0);
    stats.totalWithdrawals = BigInt.fromI32(0);
    stats.totalRewardsClaimed = BigInt.fromI32(0);
    stats.totalEmergencyWithdrawals = BigInt.fromI32(0);
    stats.averageStakeAmount = BigInt.fromI32(0);
    stats.currentRewardRate = BigInt.fromI32(0);
  }
  return stats;
}

export function handleStakingInitialized(event: StakingInitialized): void {
  let contract = new StakingContract("staking-contract");
  contract.stakingToken = event.params.stakingToken;
  contract.totalStaked = BigInt.fromI32(0);
  contract.currentRewardRate = event.params.initialRewardRate;
  contract.initialApr = event.params.initialRewardRate;
  contract.minLockDuration = BigInt.fromI32(0); // Will be set from contract calls
  contract.aprReductionPerThousand = BigInt.fromI32(0);
  contract.emergencyWithdrawPenalty = BigInt.fromI32(0);
  contract.totalRewards = BigInt.fromI32(0);
  contract.createdAt = event.block.timestamp;
  contract.updatedAt = event.block.timestamp;
  contract.save();
}

export function handleStaked(event: Staked): void {
  // Create stake entity
  let stake = new Stake(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  stake.user = event.params.user.toHexString();
  stake.amount = event.params.amount;
  stake.timestamp = event.params.timestamp;
  stake.newTotalStaked = event.params.newTotalStaked;
  stake.currentRewardRate = event.params.currentRewardRate;
  stake.transactionHash = event.transaction.hash;
  stake.blockNumber = event.block.number;
  stake.save();

  // Update user
  let user = getOrCreateUser(event.params.user);
  if (user.createdAt.equals(BigInt.fromI32(0))) {
    user.createdAt = event.block.timestamp;
  }
  user.stakedAmount = user.stakedAmount.plus(event.params.amount);
  user.lastStakeTimestamp = event.params.timestamp;
  user.updatedAt = event.block.timestamp;
  user.save();

  // Update contract
  let contract = StakingContract.load("staking-contract");
  if (contract != null) {
    contract.totalStaked = event.params.newTotalStaked;
    contract.currentRewardRate = event.params.currentRewardRate;
    contract.updatedAt = event.block.timestamp;
    contract.save();
  }

  // Update global stats
  let globalStats = getOrCreateGlobalStats();
  globalStats.totalStaked = event.params.newTotalStaked;
  globalStats.totalStakes = globalStats.totalStakes.plus(BigInt.fromI32(1));
  globalStats.currentRewardRate = event.params.currentRewardRate;
  globalStats.lastUpdated = event.block.timestamp;
  globalStats.save();

  // Update daily stats
  let dailyStats = getOrCreateDailyStats(event.block.timestamp);
  dailyStats.totalStaked = event.params.newTotalStaked;
  dailyStats.totalStakes = dailyStats.totalStakes.plus(BigInt.fromI32(1));
  dailyStats.currentRewardRate = event.params.currentRewardRate;
  if (dailyStats.totalStakes.gt(BigInt.fromI32(0))) {
    dailyStats.averageStakeAmount = dailyStats.totalStaked.div(dailyStats.totalStakes);
  }
  dailyStats.save();
}

export function handleWithdrawn(event: Withdrawn): void {
  // Create withdrawal entity
  let withdrawal = new Withdrawal(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  withdrawal.user = event.params.user.toHexString();
  withdrawal.amount = event.params.amount;
  withdrawal.timestamp = event.params.timestamp;
  withdrawal.newTotalStaked = event.params.newTotalStaked;
  withdrawal.currentRewardRate = event.params.currentRewardRate;
  withdrawal.rewardsAccrued = event.params.rewardsAccrued;
  withdrawal.transactionHash = event.transaction.hash;
  withdrawal.blockNumber = event.block.number;
  withdrawal.save();

  // Update user
  let user = getOrCreateUser(event.params.user);
  user.stakedAmount = user.stakedAmount.minus(event.params.amount);
  user.updatedAt = event.block.timestamp;
  user.save();

  // Update contract
  let contract = StakingContract.load("staking-contract");
  if (contract != null) {
    contract.totalStaked = event.params.newTotalStaked;
    contract.currentRewardRate = event.params.currentRewardRate;
    contract.updatedAt = event.block.timestamp;
    contract.save();
  }

  // Update global stats
  let globalStats = getOrCreateGlobalStats();
  globalStats.totalStaked = event.params.newTotalStaked;
  globalStats.totalWithdrawals = globalStats.totalWithdrawals.plus(BigInt.fromI32(1));
  globalStats.currentRewardRate = event.params.currentRewardRate;
  globalStats.lastUpdated = event.block.timestamp;
  globalStats.save();

  // Update daily stats
  let dailyStats = getOrCreateDailyStats(event.block.timestamp);
  dailyStats.totalStaked = event.params.newTotalStaked;
  dailyStats.totalWithdrawals = dailyStats.totalWithdrawals.plus(BigInt.fromI32(1));
  dailyStats.currentRewardRate = event.params.currentRewardRate;
  dailyStats.save();
}

export function handleRewardsClaimed(event: RewardsClaimed): void {
  // Create reward claim entity
  let rewardClaim = new RewardClaim(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  rewardClaim.user = event.params.user.toHexString();
  rewardClaim.amount = event.params.amount;
  rewardClaim.timestamp = event.params.timestamp;
  rewardClaim.newPendingRewards = event.params.newPendingRewards;
  rewardClaim.totalStaked = event.params.totalStaked;
  rewardClaim.transactionHash = event.transaction.hash;
  rewardClaim.blockNumber = event.block.number;
  rewardClaim.save();

  // Update user
  let user = getOrCreateUser(event.params.user);
  user.totalRewardsClaimed = user.totalRewardsClaimed.plus(event.params.amount);
  user.updatedAt = event.block.timestamp;
  user.save();

  // Update contract
  let contract = StakingContract.load("staking-contract");
  if (contract != null) {
    contract.totalRewards = contract.totalRewards.plus(event.params.amount);
    contract.updatedAt = event.block.timestamp;
    contract.save();
  }

  // Update global stats
  let globalStats = getOrCreateGlobalStats();
  globalStats.totalRewardsClaimed = globalStats.totalRewardsClaimed.plus(BigInt.fromI32(1));
  globalStats.lastUpdated = event.block.timestamp;
  globalStats.save();

  // Update daily stats
  let dailyStats = getOrCreateDailyStats(event.block.timestamp);
  dailyStats.totalRewardsClaimed = dailyStats.totalRewardsClaimed.plus(BigInt.fromI32(1));
  dailyStats.save();
}

export function handleEmergencyWithdrawn(event: EmergencyWithdrawn): void {
  // Create emergency withdrawal entity
  let emergencyWithdrawal = new EmergencyWithdrawal(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  emergencyWithdrawal.user = event.params.user.toHexString();
  emergencyWithdrawal.amount = event.params.amount;
  emergencyWithdrawal.penalty = event.params.penalty;
  emergencyWithdrawal.timestamp = event.params.timestamp;
  emergencyWithdrawal.newTotalStaked = event.params.newTotalStaked;
  emergencyWithdrawal.transactionHash = event.transaction.hash;
  emergencyWithdrawal.blockNumber = event.block.number;
  emergencyWithdrawal.save();

  // Update user
  let user = getOrCreateUser(event.params.user);
  user.stakedAmount = user.stakedAmount.minus(event.params.amount);
  user.totalEmergencyWithdrawals = user.totalEmergencyWithdrawals.plus(BigInt.fromI32(1));
  user.updatedAt = event.block.timestamp;
  user.save();

  // Update contract
  let contract = StakingContract.load("staking-contract");
  if (contract != null) {
    contract.totalStaked = event.params.newTotalStaked;
    contract.updatedAt = event.block.timestamp;
    contract.save();
  }

  // Update global stats
  let globalStats = getOrCreateGlobalStats();
  globalStats.totalStaked = event.params.newTotalStaked;
  globalStats.totalEmergencyWithdrawals = globalStats.totalEmergencyWithdrawals.plus(BigInt.fromI32(1));
  globalStats.lastUpdated = event.block.timestamp;
  globalStats.save();

  // Update daily stats
  let dailyStats = getOrCreateDailyStats(event.block.timestamp);
  dailyStats.totalStaked = event.params.newTotalStaked;
  dailyStats.totalEmergencyWithdrawals = dailyStats.totalEmergencyWithdrawals.plus(BigInt.fromI32(1));
  dailyStats.save();
}

export function handleRewardRateUpdated(event: RewardRateUpdated): void {
  // Create reward rate update entity
  let rewardRateUpdate = new RewardRateUpdate(event.transaction.hash.toHexString() + "-" + event.logIndex.toString());
  rewardRateUpdate.oldRate = event.params.oldRate;
  rewardRateUpdate.newRate = event.params.newRate;
  rewardRateUpdate.timestamp = event.params.timestamp;
  rewardRateUpdate.totalStaked = event.params.totalStaked;
  rewardRateUpdate.transactionHash = event.transaction.hash;
  rewardRateUpdate.blockNumber = event.block.number;
  rewardRateUpdate.save();

  // Update contract
  let contract = StakingContract.load("staking-contract");
  if (contract != null) {
    contract.currentRewardRate = event.params.newRate;
    contract.updatedAt = event.block.timestamp;
    contract.save();
  }

  // Update global stats
  let globalStats = getOrCreateGlobalStats();
  globalStats.currentRewardRate = event.params.newRate;
  globalStats.lastUpdated = event.block.timestamp;
  globalStats.save();

  // Update daily stats
  let dailyStats = getOrCreateDailyStats(event.block.timestamp);
  dailyStats.currentRewardRate = event.params.newRate;
  dailyStats.save();
}