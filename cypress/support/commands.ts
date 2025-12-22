// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-testid attribute.
       * @example cy.getByTestId('greeting')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to mock wallet connection
       */
      mockWalletConnection(): Chainable<void>;
      
      /**
       * Custom command to mock staking transaction
       */
      mockStakingTransaction(): Chainable<void>;
      
      /**
       * Custom command to mock wallet disconnection
       */
      mockWalletDisconnection(): Chainable<void>;
      
      /**
       * Custom command to wait for staking flow to complete
       */
      waitForStakingFlow(): Chainable<void>;
    }
  }
}

// Custom command to select element by data-testid
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Custom command to mock wallet connection
Cypress.Commands.add('mockWalletConnection', () => {
  // Mock window.ethereum
  cy.window().then((win) => {
    (win as any).ethereum = {
      isMetaMask: true,
      request: cy.stub().resolves(['0x1234567890123456789012345678901234567890']),
      on: cy.stub(),
      removeListener: cy.stub(),
    };
  });
  
  // Mock wagmi hooks
  cy.intercept('POST', '**/wagmi', {
    statusCode: 200,
    body: {
      result: '0x0000000000000000000000000000000000000000000000000000000000000001',
    },
  }).as('wagmiRequest');
});

// Custom command to mock staking transaction
Cypress.Commands.add('mockStakingTransaction', () => {
  cy.intercept('POST', '**/wagmi', {
    statusCode: 200,
    body: {
      result: '0x0000000000000000000000000000000000000000000000000000000000000001',
    },
  }).as('stakingTransaction');
});

// Custom command to mock wallet disconnection
Cypress.Commands.add('mockWalletDisconnection', () => {
  cy.window().then((win) => {
    (win as any).ethereum = undefined;
  });
});

// Custom command to wait for staking flow
Cypress.Commands.add('waitForStakingFlow', () => {
  cy.wait('@stakingTransaction');
  cy.getByTestId('staking-success').should('be.visible');
});

// Suppress uncaught exceptions during tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You can customize this based on your application's error handling
  return false;
});

export {};