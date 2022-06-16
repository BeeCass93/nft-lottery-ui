import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PaidIcon from "@mui/icons-material/Paid";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ListIcon from "@mui/icons-material/List";
import Tooltip from '@mui/material/Tooltip';
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, contract_abi } from "../Contract/contracts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

export default function Lottery({account}) {
  const [contract, setContract] = useState(null);
  const [isWhitelist, setIsWhitelist] = useState(false);
  const [lotteryHistory, setLotteryHistory] = useState([]);

  useEffect(() => {
    if (contract === null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contract_abi,
        provider.getSigner()
      );
      setContract(contract);
    }
  }, []);

  const getPlayers = async () => {
    const players = await contract.getPlayers();
    console.log(players);
  };

  // const getHistory = async (id) => {
  //   setLotteryHistory([]);
  //   for (let i = parseInt(id); i > 0; i--) {
  //     const winnerAddress = await lcContract.methods.lotteryHistory(i).call();
  //     const historyObj = {};
  //     historyObj.id = i;
  //     historyObj.address = winnerAddress;
  //     setLotteryHistory((lotteryHistory) => [...lotteryHistory, historyObj]);
  //   }
  // };

  const enterLotteryHandler = async () => {
    try {
      const overridesObj = {
        value: "10000000000000000",
        gasLimit: 300000,
        gasPrice: null,
      };
      await contract.enter(overridesObj);
    } catch (err) {
      console.log(err.message);
    }
  };

  // const pickWinnerHandler = async () => {
  //   console.log(`address from pick winner :: ${address}`);
  //   try {
  //     await lcContract.methods.pickWinner().send({
  //       from: address,
  //       gas: 300000,
  //       gasPrice: null,
  //     });
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  return (
    <Box sx={{ flexGrow: 1, margin: 6 }}>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <Item sx={{ width: 356, height: 356 }}>
            <img
              className="howape"
              src={require("../../media/howest_NFT_110.gif")}
              height="160"
              alt="howape"
            />
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item sx={{ height: 356 }}>
            <Typography gutterBottom variant="h5" component="div">
              HOWAPE: A very exclusive collection of 10 HoWest APE NFTs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ApeWest Lottery is a lottery to get a chance for a whitelist when
              the first 10 HOWest APEs will be released.
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText primary="MINT DATE: Now Live" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <PaidIcon />
                    </ListItemIcon>
                    <ListItemText primary="PRIVATE MINT PRICE: 0.1 AVAX" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary="ONLY WHITELIST" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <DirectionsBusIcon />
                    </ListItemIcon>
                    <ListItemText primary="NO PUBLIC MINT " />
                  </ListItemButton>
                </ListItem>
              </List>
              <Box sx={{ "& button": { m: 1 } }}>
                {isWhitelist ? (
                  <Button variant="contained">MINT NOW!</Button>
                ) : (
                  <Tooltip title="Only Whitelisted Addresses can mint HOWAPEs">
                  <Button variant="contained" disabled>
                    MINT NOW!
                  </Button>
</Tooltip>

                )}
              </Box>
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item sx={{ height: 256 }}>
            <Grid item xs container direction="column" spacing={4}>
              <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  Enter the lottery by sending 0.1 AVAX
                </Typography>
                <Button variant="contained" onClick={enterLotteryHandler}>
                  Enter Lottery
                </Button>
              </Grid>
              {/* <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  <b>Admin only:</b> Pick winner
                </Typography>
                <Button variant="contained" onClick={getPlayers}>
                  Pick Winner
                </Button>
              </Grid> */}
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item sx={{ height: 256 }}>
            <Typography variant="body2" color="text.secondary">
              Lottery History
            </Typography>
            {/* {lotteryHistory &&
              lotteryHistory.length > 0 &&
              lotteryHistory.map((item) => {
                if (lotteryId != item.id) {
                  return (
                    <div className="history-entry mt-3" key={item.id}>
                      <div>Lottery #{item.id} winner:</div>
                      <div>
                        <a
                          href={`https://snowtrace.io/address/${item.address}`}
                          target="_blank"
                        >
                          {item.address}
                        </a>
                      </div>
                    </div>
                  );
                }
              })} */}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
