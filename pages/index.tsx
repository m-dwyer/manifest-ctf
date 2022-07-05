import type { NextPage } from "next";
import Hero from "../components/Hero";
import Layout from "../components/Layout";

const Index: NextPage = () => {
  return (
    <div>
      <Layout>
        <Hero />
      </Layout>
    </div>
  );
};

export default Index;
