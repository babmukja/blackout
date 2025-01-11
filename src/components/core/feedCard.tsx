import { AspectRatio, Box, Button, Card, Image, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  src: string;
}

const FeedCard = ({ title, src }: Props) => {

  const router = useRouter();

  return (
    <Box
      // onClick={() => router.push(`/snap/${title}`)}
    >
      <Card.Root maxW="sm" overflow="hidden">
        <AspectRatio ratio={1}>
          <Image
            src={src}
            alt="Green double couch with wooden legs"
            objectFit="cover"
            />
        </AspectRatio>
        <Box 
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          padding={"10px"} 
          >
          <Card.Title>{title}</Card.Title>
        </Box>
        <Card.Footer gap="2">
          <p>Hello</p>
        </Card.Footer>
      </Card.Root>
    </Box>
  )
}

export default FeedCard;

