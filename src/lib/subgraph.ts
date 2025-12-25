import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// TODO: Replace with actual subgraph URL
const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/your-org/your-subgraph';

export const client = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

// GraphQL queries
export const GET_USER_TRANSACTIONS = gql`
  query GetUserTransactions($user: ID!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
    stakes(where: { user: $user }, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      user
      amount
      timestamp
      transactionHash
      blockNumber
    }
    withdrawals(where: { user: $user }, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      user
      amount
      timestamp
      transactionHash
      blockNumber
      rewardsAccrued
    }
    rewardClaims(where: { user: $user }, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      user
      amount
      timestamp
      transactionHash
      blockNumber
    }
    emergencyWithdrawals(where: { user: $user }, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      user
      amount
      timestamp
      transactionHash
      blockNumber
      penalty
    }
  }
`;