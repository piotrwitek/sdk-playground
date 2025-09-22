# GitHub Copilot Instructions

## Project Overview

This is a Next.js 14 DeFi SDK playground demonstrating cross-chain operations using Summer.fi and Enso Finance SDKs. Built with TypeScript, shadcn/ui components, and multi-chain Web3 integration featuring vault deposits, withdrawals, and complex cross-chain bridging workflows.

## Tech Stack & Key Dependencies

- **Framework**: Next.js 14.2.32 (Pages Router) with TypeScript 5.8.3
- **Package Manager**: pnpm 10.11.0
- **Styling**: Tailwind CSS 3.4.17 + shadcn/ui components
- **Web3**: wagmi + viem + ConnectKit 1.9.1
- **State Management**: @tanstack/react-query 5.45.1
- **Core SDKs**: `@ensofinance/sdk` ^1.1.7, `@summer_fi/sdk-client` ^1.2.0
- **Icons**: @radix-ui/react-icons (preferred for shadcn/ui compatibility)

## Architecture Patterns

### Feature-Based Organization

Components organized by domain in `src/features/`:

- `src/features/core/` - Main vault operations (deposit/withdraw)
- `src/features/cross-chain-deposit/` - Cross-chain bridging workflows

### SDK Client Pattern

Two primary SDK integrations in `src/clients/`:

- `enso-client.ts` - Cross-chain routing/bridging (requires `ENSO_API_KEY`)
- `sdk-client.ts` - Summer.fi protocol operations (requires `SDK_API_URL`)

### Transaction Execution Pattern

The `TransactionExecutor` component (`src/components/shared/TransactionExecutor.tsx`) is the core reusable pattern for multi-step blockchain transactions:

```tsx
<TransactionExecutor<DepositParams>
  title="Deposit"
  onFetchTransactions={fetchDepositTransactions}
  transactionParams={{ chainId, fleetAddress: vaultId, ... }}
  transactionChainId={chainId}
/>
```

## Critical Development Workflows

### Environment Setup

```bash
# Required environment variables in .env.local
ENSO_API_KEY=your_enso_api_key
SDK_API_URL=https://api.summer.fi/sdk
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Development Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint validation
pnpm install      # Install dependencies
```

### Adding New shadcn/ui Components

```bash
pnpm dlx shadcn@latest add [component-name]
pnpm dlx shadcn@latest add --help  # List available components
```

## Web3 Integration Patterns

### Chain Configuration

Wagmi configured in `src/context/Web3Provider.tsx` with Mainnet, Base, Arbitrum, Sonic chains, ConnectKit for wallet connection, and React Query for state management.

### Transaction Patterns

1. **API Route Pattern**: Complex transaction preparation happens server-side (e.g., `src/pages/api/create-enso-tx.ts`)
2. **Client Execution**: Frontend handles transaction sending via wagmi hooks
3. **Multi-step Transactions**: `TransactionExecutor` manages sequential transaction execution

### Chain State Management

```tsx
// Core pattern for chain-aware components - always reset dependent state
const [selectedChainId, setSelectedChainId] = useState<ChainId>(ChainIds.Base);

const handleChainChange = (chainId: number) => {
  setSelectedVaultId(undefined); // Reset dependent state
  setSelectedChainId(chainId as ChainId);
};
```

## SDK Usage Patterns

### Summer.fi SDK

```typescript
// Get token by symbol
const token = await sdk.tokens.getTokenBySymbol({
  chainId: ChainIds.Base,
  symbol: "USDC",
});

// Create vault operations using ArmadaVaultId pattern
const vaultId = ArmadaVaultId.createFrom({
  chainInfo: getChainInfoByChainId(chainId),
  fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
});
```

### Enso SDK

```typescript
// Cross-chain bundle operations - always server-side
const data = await ensoClient.getBundleData(
  { chainId, fromAddress, spender, routingStrategy: "router" },
  [
    { protocol: "stargate", action: "bridge", args: {...} },
    { protocol: "enso", action: "route", args: {...} }
  ]
);
```

## Component Conventions

### Import Patterns

```tsx
// UI components - use shadcn/ui and @radix-ui icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircledIcon, ArrowRightIcon } from "@radix-ui/react-icons";

// SDK types - specific imports from Summer.fi
import {
  ChainIds,
  type ChainId,
  type AddressValue,
} from "@summer_fi/sdk-client";

// Project types - organized by domain
import type { DepositParams } from "@/types/deposit";
```

### Utility Functions (`src/lib/utils.ts`)

Essential helpers for the application:

- `cn()` - Tailwind class merging with conflict resolution
- `formatCurrency()`, `formatApy()`, `formatNumberHumanReadable()` - Financial formatting
- `truncateHex()`, `truncateHexInText()` - Address/hash truncation with auto-detection
- `getChainName()` - Chain ID to human-readable name mapping for supported chains

```typescript
// Standard usage patterns
const buttonClass = cn("px-4 py-2", isActive && "bg-blue-500", "rounded");
const displayApy = formatApy(vault.apy); // "12.45%" or "N/A"
const shortHash = truncateHex(transaction.hash); // "0x1234...abcd"
const chainName = getChainName(chainId); // "Base", "Arbitrum One", etc.
```

### Conditional Rendering Pattern

```tsx
// Standard pattern for wallet/selection dependent features
if (!isConnected || !address || !vaultId || !assetTokenSymbol) {
  return null;
}
```

## Type Safety Patterns

Types organized in `src/types/` by domain:

- `deposit.ts`, `withdraw.ts` - Operation parameters with SDK types
- `vault.ts` - Vault information structures with APY/TVL formatting
- `transaction.ts` - Transaction metadata and mapping utilities
- `merkl.ts` - Merkl protocol integration types

## Key Integration Points & Workflows

### Cross-chain Flow Architecture

**Base ETH → Stargate Bridge → Arbitrum USDC → Summer.fi Vault**

- Server-side transaction preparation via Enso API
- Client-side execution via wagmi hooks
- Multi-step transaction management with status tracking

### Error Handling Patterns

- Comprehensive error states with user-friendly messages via shadcn Alert components
- Loading states with @radix-ui/react-icons for consistency
- Chain switching detection with automatic user prompts

### File Organization Best Practices

- Feature-based architecture in `src/features/` for domain-specific components
- shadcn/ui components in `src/components/ui/`
- SDK client configurations in `src/clients/`
- TypeScript types in `src/types/` by domain
- PascalCase for React components, camelCase for utilities, kebab-case for feature directories

## Performance & Development Notes

- Use larger amounts for cross-chain operations (0.01+ ETH minimum)
- Server-side transaction preparation reduces client computational load
- wagmi + React Query caching for optimal API call management
- Use Tailwind v3.x for compatibility (`pnpm add -D tailwindcss@^3`)
- Environment variables in `.env.local` for development, never commit API keys
