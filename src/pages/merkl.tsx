import React from "react";
import Head from "next/head";
import { Layout } from "../components/Layout";
import MerklRewards from "../features/merkl-rewards/MerklRewards";

const MerklPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>SDK Playground - Merkl Rewards</title>
      </Head>
      <Layout>
        <MerklRewards />
      </Layout>
    </>
  );
};

export default MerklPage;
