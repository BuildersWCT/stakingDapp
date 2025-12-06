import type { Step } from './StepIndicator';

// Step configuration constants for better organization
export interface StakingStepStatus {
  currentStep: 'approving' | 'staking' | 'idle';
}

export interface MintingStepStatus {
  isMinting: boolean;
}

export interface ClaimStepStatus {
  isClaiming: boolean;
  hasRewards: boolean;
}

// Staking steps configuration
export const createStakingSteps = (currentStep: 'approving' | 'staking' | 'idle' = 'idle'): Step[] => {
  return [
    {
      id: 'approving',
      title: 'Approve',
      description: 'Approve token spending',
      status: currentStep === 'approving' ? 'active' : (currentStep === 'staking' || currentStep === 'idle') ? 'completed' : 'pending'
    },
    {
      id: 'staking',
      title: 'Stake',
      description: 'Stake your tokens',
      status: currentStep === 'staking' ? 'active' : currentStep === 'idle' ? 'pending' : 'completed'
    }
  ];
};

// Minting steps configuration
export const createMintingSteps = (isMinting: boolean = false): Step[] => {
  return [
    {
      id: 'minting',
      title: 'Minting',
      description: 'Creating your test tokens',
      status: isMinting ? 'active' : 'pending'
    },
    {
      id: 'completed',
      title: 'Complete',
      description: 'Tokens minted successfully',
      status: isMinting ? 'pending' : 'completed'
    }
  ];
};

// Claim steps configuration
export const createClaimSteps = (isClaiming: boolean = false, hasRewards: boolean = true): Step[] => {
  return [
    {
      id: 'checking',
      title: 'Check Rewards',
      description: 'Verifying available rewards',
      status: !hasRewards ? 'error' : isClaiming ? 'active' : 'completed'
    },
    {
      id: 'claiming',
      title: 'Claim',
      description: 'Claiming your rewards',
      status: isClaiming ? 'active' : 'completed'
    }
  ];
};

// Legacy exports for backward compatibility
export const stakingSteps = createStakingSteps;
export const mintingSteps = createMintingSteps;
export const claimSteps = createClaimSteps;