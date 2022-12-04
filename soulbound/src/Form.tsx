import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  useColorMode,
  Text,
  Checkbox,
  Stack,
  InputGroup,
  InputLeftAddon,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const addMsg = "Wallet address 0x...";
const addMsgGit = "Paste repo link here";
const emptyAddress = {
  private: false,
  address: "",
};

const emptyLink = {
  name: "",
  url: "",
};

export const Form = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [wallets, setWallets] = useState<typeof emptyAddress[]>([]);
  const [wallets2, setWallets2] = useState<typeof emptyAddress[]>([]);
  const [links, setLinks] = useState<typeof emptyLink[]>([]);
  const [links2, setLinks2] = useState<typeof emptyLink[]>([]);
  const [name, setName] = useState<string>();
  const [dataSended, setDataSended] = useState(false);

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, []);

  const addWallet = () => {
    if (wallets.length === 5) return;
    setWallets((old) => [...old, emptyAddress]);
    setWallets2((old) => [...old, emptyAddress]);
  };

  const removeWallet = (index: number) => {
    setWallets((old) => old.filter((_, i) => i !== index));
    setWallets2((old) => old.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setLinks((old) => [...old, emptyLink]);
    setLinks2((old) => [...old, emptyLink]);
  };

  const onLinkChange = (index: number, newValue: typeof emptyLink) => {
    setLinks2((old) => old.map((value, i) => (i === index ? newValue : value)));
  };

  const onWalletChange = (index: number, newValue: typeof emptyAddress) => {
    setWallets2((old) =>
      old.map((value, i) => (i === index ? newValue : value))
    );
  };

  const removeLink = (index: number) => {
    setLinks((old) => old.filter((_, i) => i !== index));
    setLinks2((old) => old.filter((_, i) => i !== index));
  };
  useEffect(() => {
    if (dataSended) {
      setLinks(() => [emptyLink]);
      setLinks2(() => [emptyLink]);
      setWallets(() => [emptyAddress]);
      setWallets2(() => [emptyAddress]);
      setName(undefined);
    }
  }, [dataSended]);

  const onSubmit = () => {
    if (!name || !wallets2.length || !links2.length) {
      return;
    }
    const data = {
      name,
      wallets: wallets2,
      links: links2,
    };
    console.log({ data });

    axios
      .post("http://94.130.172.47:1337/api/records", { data })
      .then(() => setDataSended(true));
  };

  if (dataSended) {
    return (
      <Flex m="0 auto" flexDirection="column" width={400}>
        <Text fontSize="4xl">
          Data sended,{" "}
          <span
            style={{
              cursor: "pointer",
              color: "aquamarine",
              borderBottom: "1px dashed aquamarine",
            }}
            onClick={() => {
              setDataSended(false);
            }}
          >
            send more
          </span>
        </Text>
      </Flex>
    );
  }

  return (
    <Flex m="0 auto" flexDirection="column" width={400}>
      <Heading>Add team</Heading>
      <FormLabel mt={4}>Team name</FormLabel>
      <Input onChange={(e) => setName(e.target.value)} />
      <FormLabel mt={4}>Members wallets</FormLabel>
      <Box my={2}>
        {wallets.map((w, i) => {
          return (
            <Box css={walletsWrapper} key={`${w}-${i}`}>
              <Flex alignItems="center" justifyContent="space-between">
                <InputGroup>
                  <InputLeftAddon children="Wallet" width="75px" />
                  <Input
                    placeholder={addMsg}
                    width={200}
                    value={wallets2[i].address}
                    onChange={(e) =>
                      onWalletChange(i, {
                        ...wallets2[i],
                        address: e.target.value,
                      })
                    }
                    // value
                  />
                </InputGroup>
                <Checkbox
                  defaultChecked={w.private}
                  onChange={(e) =>
                    onWalletChange(i, {
                      ...wallets2[i],
                      private: e.target.checked,
                    })
                  }
                >
                  Private
                </Checkbox>
                <Box ml={2} cursor="pointer" onClick={() => removeWallet(i)}>
                  <DeleteIcon color="gray" />
                </Box>
              </Flex>
            </Box>
          );
        })}
        <Box mt={2}>
          <Button onClick={addWallet}>
            {`Add one more address ${wallets.length}/5`}
            <Box ml={2}>
              <AddIcon />
            </Box>
          </Button>
        </Box>
      </Box>
      <Box mt={4}>
        <FormLabel>Project links</FormLabel>
      </Box>
      <Box my={2}>
        {links.map((w, i) => {
          return (
            <Stack spacing={1} mb={5} key={`${w}-${i}`}>
              <Flex>
                <InputGroup>
                  <InputLeftAddon children="name" width="80px" />
                  <Input
                    placeholder="Resource  name"
                    width={300}
                    onChange={(e) =>
                      onLinkChange(i, { ...links2[i], name: e.target.value })
                    }
                  />
                </InputGroup>
                <Box cursor="pointer" onClick={() => removeLink(i)}>
                  <DeleteIcon color="gray" />
                </Box>
              </Flex>
              <Flex>
                <InputGroup>
                  <InputLeftAddon children="url" width="80px" />
                  <Input
                    placeholder="Resource url"
                    width={300}
                    onChange={(e) =>
                      onLinkChange(i, { ...links2[i], url: e.target.value })
                    }
                  />
                </InputGroup>
              </Flex>
            </Stack>
          );
        })}
        <Box mt={4}>
          <Button onClick={addLink}>{`Add one more link`}</Button>
        </Box>
      </Box>
      <Button onClick={onSubmit}>Send</Button>
    </Flex>
  );
};

const walletsWrapper = {
  margin: "4px 0",
};
