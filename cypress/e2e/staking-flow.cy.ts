describe('Complete Staking Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.mockWalletConnection();
  });

  describe('User Journey: Connect Wallet to Stake Tokens', () => {
    it('should complete the entire staking flow from wallet connection to staking confirmation', () => {
      // Step 1: Connect wallet
      cy.getByTestId('connect-wallet-button').should('be.visible').click();
      
      // Step 2: Verify wallet connection
      cy.getByTestId('wallet-address').should('be.visible');
      cy.getByTestId('connect-wallet-button').should('not.exist');
      
      // Step 3: Navigate to staking section
      cy.getByTestId('stake-tab').should('be.visible').click();
      
      // Step 4: Check staking form is loaded
      cy.getByTestId('stake-form').should('be.visible');
      cy.getByTestId('balance-display').should('contain', 'Balance: 10.0 TOKEN');
      
      // Step 5: Enter staking amount
      cy.getByTestId('stake-amount-input').type('5');
      
      // Step 6: Verify amount validation
      cy.getByTestId('stake-button').should('not.be.disabled');
      cy.getByTestId('max-button').click();
      cy.getByTestId('stake-amount-input').should('have.value', '10.0');
      
      // Step 7: Reset to desired amount and stake
      cy.getByTestId('stake-amount-input').clear().type('3.5');
      cy.mockStakingTransaction();
      cy.getByTestId('stake-button').click();
      
      // Step 8: Verify transaction submission
      cy.getByTestId('transaction-pending').should('be.visible');
      
      // Step 9: Wait for confirmation
      cy.waitForStakingFlow();
      cy.getByTestId('staking-success').should('be.visible');
      cy.getByTestId('transaction-hash').should('be.visible');
      
      // Step 10: Verify stake position is updated
      cy.getByTestId('my-stake').should('contain', '3.5');
    });

    it('should handle wallet disconnection during staking flow', () => {
      // Connect wallet
      cy.getByTestId('connect-wallet-button').click();
      cy.getByTestId('wallet-address').should('be.visible');
      
      // Navigate to staking
      cy.getByTestId('stake-tab').click();
      cy.getByTestId('stake-form').should('be.visible');
      
      // Disconnect wallet
      cy.mockWalletDisconnection();
      cy.getByTestId('connect-wallet-button').should('be.visible');
      cy.getByTestId('stake-form').should('not.exist');
    });

    it('should handle insufficient balance scenario', () => {
      // Connect wallet
      cy.getByTestId('connect-wallet-button').click();
      cy.getByTestId('wallet-address').should('be.visible');
      
      // Navigate to staking
      cy.getByTestId('stake-tab').click();
      cy.getByTestId('stake-form').should('be.visible');
      
      // Try to stake more than balance
      cy.getByTestId('stake-amount-input').type('15'); // More than 10.0 balance
      
      // Verify validation message
      cy.getByTestId('insufficient-balance-error').should('be.visible');
      cy.getByTestId('stake-button').should('be.disabled');
    });
  });

  describe('Withdrawal Flow', () => {
    beforeEach(() => {
      // Set up existing stake for withdrawal tests
      cy.window().then((win) => {
        // Mock existing stake position
        (win as any).mockStakePosition = {
          stakedAmount: '5000000000000000000', // 5 tokens
          rewards: '1000000000000000000', // 1 token
        };
      });
    });

    it('should complete withdrawal flow successfully', () => {
      // Connect wallet and navigate to withdraw tab
      cy.getByTestId('connect-wallet-button').click();
      cy.getByTestId('withdraw-tab').click();
      
      // Verify withdrawal form
      cy.getByTestId('withdraw-form').should('be.visible');
      cy.getByTestId('staked-amount').should('contain', '5.0');
      cy.getByTestId('rewards-amount').should('contain', '1.0');
      
      // Withdraw staked amount
      cy.getByTestId('withdraw-amount-input').type('2.5');
      cy.mockStakingTransaction();
      cy.getByTestId('withdraw-button').click();
      
      // Verify transaction
      cy.getByTestId('transaction-pending').should('be.visible');
      cy.wait('@stakingTransaction');
      cy.getByTestId('withdrawal-success').should('be.visible');
    });

    it('should claim rewards successfully', () => {
      // Connect wallet and navigate to withdraw tab
      cy.getByTestId('connect-wallet-button').click();
      cy.getByTestId('withdraw-tab').click();
      
      // Claim rewards
      cy.getByTestId('claim-rewards-button').click();
      cy.mockStakingTransaction();
      
      // Verify transaction
      cy.getByTestId('transaction-pending').should('be.visible');
      cy.wait('@stakingTransaction');
      cy.getByTestId('rewards-claimed-success').should('be.visible');
    });
  });

  describe('Emergency Withdrawal Flow', () => {
    it('should handle emergency withdrawal', () => {
      // Connect wallet
      cy.getByTestId('connect-wallet-button').click();
      
      // Access emergency withdrawal
      cy.getByTestId('emergency-withdraw-tab').click();
      cy.getByTestId('emergency-withdraw-form').should('be.visible');
      
      // Trigger emergency withdrawal
      cy.mockStakingTransaction();
      cy.getByTestId('emergency-withdraw-button').click();
      
      // Confirm emergency withdrawal
      cy.getByTestId('emergency-withdraw-confirm').click();
      
      // Verify transaction
      cy.getByTestId('transaction-pending').should('be.visible');
      cy.wait('@stakingTransaction');
      cy.getByTestId('emergency-withdrawal-success').should('be.visible');
    });
  });

  describe('Error Handling Scenarios', () => {
    it('should handle transaction failure gracefully', () => {
      // Connect wallet
      cy.getByTestId('connect-wallet-button').click();
      cy.getByTestId('stake-tab').click();
      
      // Attempt staking with mocked failure
      cy.getByTestId('stake-amount-input').type('1');
      cy.intercept('POST', '**/wagmi', {
        statusCode: 400,
        body: { error: 'Transaction failed' },
      }).as('failedTransaction');
      
      cy.getByTestId('stake-button').click();
      cy.wait('@failedTransaction');
      
      // Verify error handling
      cy.getByTestId('staking-error').should('be.visible');
      cy.getByTestId('error-message').should('contain', 'Transaction failed');
    });

    it('should handle network switching during transaction', () => {
      // Connect wallet
      cy.getByTestId('connect-wallet-button').click();
      cy.getByTestId('stake-tab').click();
      
      // Start staking transaction
      cy.getByTestId('stake-amount-input').type('1');
      cy.getByTestId('stake-button').click();
      
      // Simulate network change
      cy.window().then((win) => {
        const event = new Event('chainChanged');
        (win as any).ethereum?.on?.('chainChanged', () => {});
        win.dispatchEvent(event);
      });
      
      // Verify transaction is cancelled/reset
      cy.getByTestId('transaction-cancelled').should('be.visible');
      cy.getByTestId('stake-form').should('be.visible');
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should work correctly on mobile devices', () => {
      // Connect wallet on mobile
      cy.getByTestId('mobile-connect-button').should('be.visible').click();
      cy.getByTestId('wallet-address').should('be.visible');
      
      // Navigate staking on mobile
      cy.getByTestId('mobile-stake-tab').click();
      cy.getByTestId('stake-form').should('be.visible');
      
      // Complete staking flow on mobile
      cy.getByTestId('stake-amount-input').type('2.5');
      cy.mockStakingTransaction();
      cy.getByTestId('stake-button').click();
      
      cy.wait('@stakingTransaction');
      cy.getByTestId('staking-success').should('be.visible');
    });

    it('should handle mobile navigation correctly', () => {
      // Connect wallet
      cy.getByTestId('mobile-connect-button').click();
      
      // Test mobile menu navigation
      cy.getByTestId('mobile-menu-button').click();
      cy.getByTestId('mobile-menu').should('be.visible');
      
      // Navigate through mobile menu
      cy.getByTestId('mobile-stake-link').click();
      cy.getByTestId('stake-form').should('be.visible');
    });
  });

  describe('Performance and Loading States', () => {
    it('should show appropriate loading states', () => {
      // Connect wallet
      cy.getByTestId('connect-wallet-button').click();
      
      // Verify loading states during navigation
      cy.getByTestId('stake-tab').click();
      cy.getByTestId('loading-indicator').should('be.visible');
      cy.getByTestId('stake-form').should('be.visible');
      
      // Verify loading during balance fetching
      cy.getByTestId('balance-loading').should('be.visible');
      cy.getByTestId('balance-display').should('contain', 'Balance: 10.0 TOKEN');
    });

    it('should handle slow network conditions', () => {
      // Simulate slow network
      cy.intercept('**/wagmi', (req) => {
        req.reply((res) => {
          setTimeout(() => {
            res.send({
              body: {
                result: '0x0000000000000000000000000000000000000000000000000000000000000001',
              },
            });
          }, 2000);
        });
      });
      
      // Connect wallet with slow network
      cy.getByTestId('connect-wallet-button').click();
      cy.getByTestId('slow-connection-notice').should('be.visible');
      
      // Continue with staking after delay
      cy.getByTestId('stake-tab').click();
      cy.getByTestId('stake-form').should('be.visible');
    });
  });
});