import Image from "next/image";
import { Provider } from "@/components/ui/provider";
import { Box } from "@chakra-ui/react";
import Link from "next/link";
import Header from "@/components/core/header";

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <Header />
          <Box
            style={{
              padding: 15,
            }}
          >
            {children}
          </Box>
        </Provider>
      </body>
    </html>
  );
};
