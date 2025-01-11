"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { Card, Button, Box, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <Box>
      <Stack spaceY={"10px"}>
        <Image
          className={styles.logo}
          src="/home_top.png"
          alt="Home"
          width={2000}
          height={2000}
          priority
        />
        <Card.Root 
          width="full"
          backgroundColor={"#f1f3f4"}
          border={"none"}
          borderRadius={"8px"}
        >
          <Card.Body gap="2">
            <Card.Title mt="2">헬멧 스냅</Card.Title>
            <Card.Description>
              This is the card body. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
              Curabitur nec odio vel dui euismod fermentum.
            </Card.Description>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Button onClick={() => {
                router.push("/snap")
              }}
            >
              둘러보기
            </Button>
          </Card.Footer>
        </Card.Root>
        <Image
          className={styles.logo}
          src="/home_bottom.png"
          alt="Next.js logo"
          width={2000}
          height={2000}
          priority
        />
      </Stack>
    </Box>
  );
}
