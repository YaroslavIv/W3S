import React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { Form } from "./Form";
// import image from "./bg.jpg";

function App() {
  return (
    <ChakraProvider>
      <Box
        css={{
          // "background-image": `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "scroll",
        }}
        pt="80px"
        pb={100}
        width="100vw"
        height="100vh"
      >
        <Form />
      </Box>
    </ChakraProvider>
  );
}

export default App;
