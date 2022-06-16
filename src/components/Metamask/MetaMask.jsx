import { useMetaMask } from "metamask-react";
import { chains } from "./chains";
import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Lottery from '../Lottery/Lottery';

import "./MetaMask.css";
import Header from "../Header/Header";

function Metamask() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [error, setError] = useState({ label: "", message: "" });
  const validChainIds = [chains.avalanche_testnet.chainId];

  const switchChain = async (chainId) => {
    const chain = chains[chainId];
    if (!chain) {
      setError({
        label: `Something went wrong connecting to ${chainId}`,
        message: "This Chain is not a valid option",
      });
    } else {
      try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...chain,
            },
          ],
        });
      } catch (err) {
        setError({
          message: err.message,
          label: `Something went wrong connecting to ${chain.chainName}`,
        });
      }
    }
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(account);
    alert("Address copied");
  };

  const handleNetworkSwitch = async (networkName) => {
    setError({ label: "", message: "" });
    await switchChain(networkName);
  };

  const networkChanged = (chainId) => {
    console.log({ chainId });
  };


  useEffect(() => {
    window.ethereum.on("chainChanged", networkChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", networkChanged);
    };
  }, []);

  let appContent = <p>{status}</p>;

  if (status === "unavailable" && Object.keys(error).length === 0) {
    setError({
      label: "Metamask extension is not available",
      message: "Please donwload the metamask extension in order to continue",
    });
    appContent = <ErrorMessage message={error.message} label={error.label} />;
  }
  if (status === "connected" && !validChainIds.includes(chainId)) {
    appContent = (
      <>
        <Header></Header>
        <Box sx={{ '& button': { m: 1 } }}>
          <Button
          variant="contained"
            onClick={() => handleNetworkSwitch("avalanche_testnet")}
          >
            Connect to Avalanche Network
          </Button>
          {Object.keys(error) > 0 && (
            <ErrorMessage message={error.message} label={error.label} />
          )}
        </Box>
      </>
    );
  }
  if (status === "connected" && !!validChainIds.includes(chainId)) {
    const button = (
      <Button
        onClick={() => {
          copyAddress();
        }}
        style={{ background: "#e5771b" }}
        variant="contained"
      >
        <img
          className="mmfox"
          src={require("../../media/mm_fox.png")}
          height="60"
          alt="foxie"
        />
        {account &&
          `${account.slice(0, 6)}...${account.slice(
            account.length - 4,
            account.length
          )}`}
      </Button>
    );
    appContent = (
      <>
        <Header button={button}></Header>
        <Lottery account={account}> </Lottery>
      </>
    );
  }

  // if (status === "connected") return <div>Connected account {account} on chain {getChainfromId(chainId)}</div>

  return (
    <>
  <div className="contentwrapper">
    {appContent}
    </div>
    <div className="footer">
          <span> This project was created by Michiel Ghyselinck and Sebastien Pattyn for the @Home Clockhain Project from Howest</span>
        </div>
    </>
    );
}

export default Metamask;
