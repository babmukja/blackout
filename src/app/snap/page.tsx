"use client"

import FeedCard from "@/components/core/feedCard";
import { Grid } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Page() {

  const router = useRouter();

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap="15px">
      <FeedCard title="@gdragon" src="/gd.png" />
      <FeedCard title="@eyeswonyoung" src="/wonyoung.png" />
      <FeedCard title="@eyeswonyoung" src="/wonyoung.png" />
      <FeedCard title="@gdragon" src="/gd.png" />
      <FeedCard title="@gdragon" src="/gd.png" />
      <FeedCard title="@eyeswonyoung" src="/wonyoung.png" />
      <FeedCard title="@eyeswonyoung" src="/wonyoung.png" />
      <FeedCard title="@gdragon" src="/gd.png" />
      <FeedCard title="@gdragon" src="/gd.png" />
      <FeedCard title="@eyeswonyoung" src="/wonyoung.png" />
      <FeedCard title="@eyeswonyoung" src="/wonyoung.png" />
      <FeedCard title="@gdragon" src="/gd.png" />
      <FeedCard title="@gdragon" src="/gd.png" />
      <FeedCard title="@eyeswonyoung" src="/wonyoung.png" />
      <FeedCard title="@eyeswonyoung" src="/wonyoung.png" />
      <FeedCard title="@gdragon" src="/gd.png" />
    </Grid>
  );
}
