import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "@/components/Layout";
import PositionActivity from "@/features/position-activity/PositionActivity";

const PositionActivityPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SDK Playground - Position Activity</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Position Activity
            </h2>
            <p className="text-slate-600 max-w-2xl">
              Inspect historical deposit and withdrawal activity for any vault
              and user position via the Summer.fi SDK.
            </p>
          </div>
          <PositionActivity />
        </div>
      </Layout>
    </>
  );
};

export default PositionActivityPage;
