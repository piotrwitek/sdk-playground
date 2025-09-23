import React from "react";
import Head from "next/head";
import { Layout } from "@/components/Layout";
import Rewards from "@/features/merkl-rewards/Rewards";

const RewardsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>SDK Playground - Rewards</title>
      </Head>
      <Layout>
        <Rewards />
      </Layout>
    </>
  );
};

export default RewardsPage;
