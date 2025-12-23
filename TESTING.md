# Crystal Stakes Testing Suite

A comprehensive testing suite for the Crystal Stakes DeFi application ensuring reliability and security of all staking operations.

## 🧪 Testing Architecture

### Testing Pyramid

Our testing strategy follows the testing pyramid approach:

```
    /\
   /  \        E2E Tests (Cypress)
  /____\      - Complete user flows
 /      \     - Cross-browser testing
/________\    - Performance validation

   /\
  /  \       Integration Tests
 /____\      - Web3 interactions
/      \     - Component integration
/________\   - Contract interactions

 /\
/  \      Unit Tests (Jest + Testing Library)
/____\    - Component testing
/    \    - Logic validation
/______\  - Isolated function testing
```

## 📦 Test Structure

```
src/
├── __tests__/              # Unit tests
│   ├── components/         # Component unit tests
│   ├── hooks/             # Custom hook tests
│   └── utils/             # Utility function tests
├── integration/           # Integration tests
│   └── __tests__/         # Web3 integration tests
├── utils/                 # Test utilities
│   ├── test-utils.tsx     # Test wrapper components
│   └── mock-web3.ts       # Web3 mocking utilities
└── setupTests.ts          # Jest setup configuration

cypress/
├── e2e/                   # End-to-end tests
│   ├── staking-flow.cy.ts # Complete staking flows
│   └── wallet.cy.ts       # Wallet interactions
└── support/
    ├── commands.ts        # Custom Cypress commands
    └── e2e.ts            # Cypress configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Verify setup:**
   ```bash
   npm run test
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run test` | Run unit tests in watch mode |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Open Cypress E2E test runner |
| `npm run test:e2e:headless` | Run E2E tests in headless mode |

## 🧩 Unit Tests

### Component Testing

Unit tests focus on individual components in isolation:

```typescript
// Example: Testing a staking form component
describe('StakeForm', () => {
  it('validates input amount', async () => {
    const user = userEvent.setup();
    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText(/amount/i);
    await user.type(input, '15'); // Exceeds balance
    
    expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
  });
});
```

### Mock Strategy

- **Web3 Mocks**: Complete mock of Ethereum provider and wagmi hooks
- **Component Mocks**: Isolated component testing without external dependencies
- **API Mocks**: Simulated backend responses for integration scenarios

### Testing Patterns

1. **Render Testing**: Verify component renders without errors
2. **User Interaction**: Test click, type, and form interactions
3. **State Management**: Validate state changes and updates
4. **Error Handling**: Test error states and edge cases
5. **Accessibility**: Ensure components are accessible

## 🔗 Integration Tests

### Web3 Integration

Integration tests verify Web3 interactions:

```typescript
describe('Web3 Integration Tests', () => {
  it('handles wallet connection state changes', async () => {
    render(<App />);
    
    // Simulate connection
    mockWalletConnection();
    
    await waitFor(() => {
      expect(screen.getByTestId('wallet-address')).toBeInTheDocument();
    });
  });
});
```

### Testing Scenarios

- **Wallet Connection**: Connect, disconnect, account changes
- **Contract Interactions**: Read and write operations
- **Transaction Flow**: Submit, confirm, error handling
- **Network Changes**: Chain switching, RPC failures

## 🎭 End-to-End Tests

### User Journey Testing

E2E tests simulate real user interactions:

```typescript
describe('Complete Staking Flow', () => {
  it('should stake tokens successfully', () => {
    cy.visit('/');
    cy.connectWallet();
    cy.getByTestId('stake-tab').click();
    cy.getByTestId('stake-amount-input').type('5');
    cy.getByTestId('stake-button').click();
    cy.getByTestId('staking-success').should('be.visible');
  });
});
```

### Coverage Areas

- **Complete User Flows**: From wallet connection to staking confirmation
- **Error Scenarios**: Failed transactions, network issues
- **Mobile Experience**: Responsive design and touch interactions
- **Performance**: Load times, animation smoothness

## 🛠 Test Utilities

### Web3 Mocking

```typescript
// Setup Web3 mocks for testing
import { setupWeb3Mocks, mockAccount } from '../utils/mock-web3';

beforeEach(() => {
  setupWeb3Mocks();
  // Configure mock responses
});
```

### Custom Render

```typescript
// Wrap components with providers
import { render } from '../utils/test-utils';

render(<Component />, {
  // Custom options
});
```

## 📊 Coverage Requirements

### Coverage Thresholds

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Coverage Report

Generate coverage report:
```bash
npm run test:coverage
```

View detailed coverage in `coverage/index.html`.

## 🔧 Configuration

### Jest Configuration

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Cypress Configuration

```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});
```

## 🚦 CI/CD Integration

### GitHub Actions

Automated testing on every push and pull request:

- **Unit Tests**: Run on multiple Node.js versions
- **E2E Tests**: Browser-based testing
- **Coverage**: Upload to Codecov
- **Accessibility**: Automated a11y testing
- **Performance**: Lighthouse CI integration

### Quality Gates

- All tests must pass
- Coverage thresholds must be met
- No linting errors
- TypeScript compilation successful

## 🐛 Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm test ConnectWallet.test.tsx

# Run tests in watch mode
npm run test:watch

# Debug with Node inspector
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

### E2E Tests

```bash
# Open Cypress test runner
npm run test:e2e

# Run specific test file
npx cypress run --spec "cypress/e2e/staking-flow.cy.ts"

# Debug with browser dev tools
npx cypress open
```

## 📝 Writing Tests

### Best Practices

1. **Test Naming**: Use descriptive test names that explain the scenario
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Isolation**: Each test should be independent
4. **Coverage**: Test both happy path and edge cases
5. **Mocking**: Mock external dependencies appropriately

### Test Patterns

#### User Interaction Testing
```typescript
it('submits form on button click', async () => {
  const user = userEvent.setup();
  render(<Form onSubmit={mockSubmit} />);
  
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith(expectedData);
});
```

#### Async Testing
```typescript
it('loads data asynchronously', async () => {
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});
```

#### Error State Testing
```typescript
it('displays error message on failure', () => {
  render(<Component error="Network Error" />);
  
  expect(screen.getByText(/network error/i)).toBeInTheDocument();
});
```

## 🔒 Security Testing

### Web3 Security

- **Transaction Validation**: Ensure proper input validation
- **Reentrancy Protection**: Test for potential reentrancy attacks
- **Access Control**: Verify proper access control mechanisms
- **Gas Estimation**: Test gas usage and estimation

### Input Validation

- **Amount Validation**: Prevent invalid staking amounts
- **Address Validation**: Ensure proper address formatting
- **Sanitization**: Test for XSS and injection attacks

## 📱 Mobile Testing

### Responsive Design

- Test on various screen sizes
- Verify touch interactions
- Check mobile navigation
- Validate performance on mobile devices

### Cross-Browser Testing

- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Test Web3 wallet compatibility

## 🚀 Performance Testing

### Load Testing

- Page load times
- Bundle size optimization
- Runtime performance
- Memory usage

### Metrics

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

## 📚 Additional Resources

### Documentation

- [Jest Documentation](https://jestjs.io/)
- [Testing Library Documentation](https://testing-library.com/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Wagmi Testing Guide](https://wagmi.sh/testing)

### Tools

- **Coverage**: Istanbul, Codecov
- **Accessibility**: cypress-axe, jest-axe
- **Performance**: Lighthouse CI
- **Types**: TypeScript, ESLint

## 🤝 Contributing

### Adding New Tests

1. Follow existing patterns and structure
2. Add appropriate mocks and utilities
3. Include both positive and negative test cases
4. Update documentation as needed

### Code Review Checklist

- [ ] Tests follow naming conventions
- [ ] All test scenarios are covered
- [ ] Mocks are properly isolated
- [ ] Error cases are tested
- [ ] Documentation is updated

## 🆘 Troubleshooting

### Common Issues

**Tests timing out**
- Increase timeout values
- Check for unresolved promises
- Verify mock configurations

**Flaky tests**
- Check for race conditions
- Ensure proper cleanup
- Use more specific selectors

**Coverage not reaching thresholds**
- Add missing test cases
- Test error handling paths
- Cover edge cases

For additional help, check the project wiki or open an issue.