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
            <Card.Title mt="2">지쿠를 지켜츄!</Card.Title>
            <Card.Description>
              대기오염, 기후변화, 바이러스가 일상인 현 시대의 지구🌑
              더 이상 지구를 이대로 내버려 둘 수 없츄!!
              파멸로 다가가고 있는 지구를 지키기 위해 당신이 나선다!!
              지쿠 이용자 한 명 한 명이 지구 지킴이가 되는 그날까지!! 지쿠를 지켜츄!!
              여러분 모두 다 함께 지쿠를 지켜 츄세요~🌏🌏
            </Card.Description>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Button onClick={() => {
                router.push("/map")
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
