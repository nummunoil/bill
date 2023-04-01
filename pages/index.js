import Head from "next/head";
import Bill from "../components/bill";

const assetPrefix = "/bill";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Splitting bills with friends</title>
        <meta
          name="Drop some money"
          content="Check, check, check, check that money"
        />
        <link rel="icon" href={`${assetPrefix}/favicon.ico`} />
      </Head>
      <Bill />
      <footer className="m-auto p-2 text-center">Powered by Nummunoil</footer>
    </div>
  );
}
