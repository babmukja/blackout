"use client"

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [sticky, setSticky] = useState<boolean>(false);

  const handleScroll = () => {
    (window.scrollY > 0) ? setSticky(true) : setSticky(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Link href="/">
      <Box
        as="header"
        overflow="hidden"
        position="sticky"
        top="0"
        display="flex"
        alignItems="center"
        zIndex="10"
        background="rgba(255, 255, 255, 1)"
        width="100%"
        height="70px"
        transition="box-shadow 0.3s ease"
        shadow={sticky ? "sm" : "none"}
      >
        <Box
          padding={"15px"}
          shadow={"md"}
        >
          <Image
            src="/header.png"
            alt="Header"
            width={2000}
            height={2000}
            priority
          />
        </Box>
      </Box>
    </Link>
  );
}
