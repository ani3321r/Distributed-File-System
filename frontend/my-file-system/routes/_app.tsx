import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <Head>
        <link rel="stylesheet" href="/main.css" />
      </Head>
      <body>
        <Component />
      </body>
    </html>
  );
}