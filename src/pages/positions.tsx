import React from "react";
import { Layout } from "../components/Layout";
import Positions from "../features/positions/Positions";
import Head from "next/head";

const PositionsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>SDK Playground - Positions</title>
      </Head>
      <Layout>
        <Positions />
      </Layout>
    </>
  );
};

export default PositionsPage;
