import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormLabel,
  Input,
  useColorMode,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const addMsg = "Add wallet address 0x...";
const addMsgGit = "Paste repo link here";

export const Form = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [wallets, setWallets] = useState<string[]>([]);
  const [wallets2, setWallets2] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [links2, setLinks2] = useState<string[]>([]);
  const [name, setName] = useState<string>();
  const [dataSended, setDataSended] = useState(false);

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, []);

  const addWallet = () => {
    if (wallets.length === 5) return;
    setWallets((old) => [...old, addMsg]);
    setWallets2((old) => [...old, addMsg]);
  };

  const removeWallet = (index: number) => {
    setWallets((old) => old.filter((_, i) => i !== index));
    setWallets2((old) => old.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setLinks((old) => [...old, addMsgGit]);
    setLinks2((old) => [...old, addMsgGit]);
  };

  const onLinkChange = (index: number, newValue: string) => {
    setLinks2((old) => old.map((value, i) => (i === index ? newValue : value)));
  };

  const onWalletChange = (index: number, newValue: string) => {
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
      setLinks(() => [addMsgGit]);
      setLinks2(() => [addMsgGit]);
      setWallets(() => [addMsg]);
      setWallets2(() => [addMsg]);
      setName(undefined);
    }
  }, [dataSended]);

  const onSubmit = () => {
    if (!name || !wallets2.length || !links2.length) {
      return;
    }
    const data = {
      name,
      wallets: wallets2.join(","),
      links: links2.join(","),
    };

    axios
      .post("http://localhost:1337/api/records", { data })
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
      <FormLabel>
        Team name
        <Input onChange={(e) => setName(e.target.value)} />
      </FormLabel>
      <FormLabel>Members wallets</FormLabel>
      <Box my={2}>
        {wallets.map((w, i) => {
          return (
            <Box css={walletsWrapper} key={`${w}-${i}`}>
              <Editable placeholder={addMsg} defaultValue={wallets[i]}>
                <Flex alignItems="center" justifyContent="space-between">
                  <EditablePreview
                    width={300}
                    overflow="hidden"
                    wordBreak="keep-all"
                  />
                  <EditableInput
                    width={300}
                    onChange={(e) => onWalletChange(i, e.target.value)}
                    // value
                  />
                  <Box cursor="pointer" onClick={() => removeWallet(i)}>
                    <DeleteIcon color="gray" />
                  </Box>
                </Flex>
              </Editable>
            </Box>
          );
        })}

        <Button onClick={addWallet}>
          {`${wallets.length}/5`}
          <Box ml={2}>
            <AddIcon />
          </Box>
        </Button>
      </Box>
      <Box mt={4}>
        <FormLabel>Project links</FormLabel>
      </Box>
      <Box my={2}>
        {links.map((w, i) => {
          return (
            <Box key={`${w}-${i}`}>
              <Editable defaultValue={links[i]}>
                <Flex alignItems="center" justifyContent="space-between">
                  <EditablePreview
                    width={300}
                    overflow="hidden"
                    wordBreak="keep-all"
                  />
                  <EditableInput
                    width={300}
                    onChange={(e) => onLinkChange(i, e.target.value)}
                  />
                  <Box cursor="pointer" onClick={() => removeLink(i)}>
                    <DeleteIcon color="gray" />
                  </Box>
                </Flex>
              </Editable>
            </Box>
          );
        })}
        <Button onClick={addLink}>
          {`Add link`}
          <Box ml={2}>
            <AddIcon />
          </Box>
        </Button>
      </Box>
      <Button onClick={onSubmit}>Send</Button>
    </Flex>
  );
};

const walletsWrapper = {
  margin: "4px 0",
  padding: "4px 8px",
};
