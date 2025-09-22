import type { NextPage } from "next";
import CrossChainDeposit from "../features/cross-chain-deposit/CrossChainDeposit";
import { Layout } from "../components/Layout";
import Head from "next/dist/shared/lib/head";

const CrossChainPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SDK Playground - Cross-Chain Deposit</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Cross-Chain</h2>
            <p className="text-slate-600 max-w-md">
              Bridge ETH from Base to Arbitrum and deposit into Summer.fi vaults
              seamlessly
            </p>
          </div>
          <CrossChainDeposit />
        </div>
      </Layout>
    </>
  );
};

export default CrossChainPage;
