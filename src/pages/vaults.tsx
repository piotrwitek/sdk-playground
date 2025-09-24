import type { NextPage } from "next";
import Vaults from "../features/vaults/Vaults";
import { Layout } from "../components/Layout";
import Head from "next/dist/shared/lib/head";

const VaultsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SDK Playground - Vaults</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Vaults</h2>
            <p className="text-slate-600 max-w-md">
              Essential SDK features and core functionality
            </p>
          </div>
          <Vaults />
        </div>
      </Layout>
    </>
  );
};

export default VaultsPage;
