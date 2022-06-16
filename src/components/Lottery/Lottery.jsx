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
import Tooltip from "@mui/material/Tooltip";
import { ethers } from "ethers";
import {
  LOTTERY_CONTRACT_ADDRESS,
  MINTING_CONTRACT_ADDRESS,
  lottery_contract_abi,
  minting_contract_abi,
} from "../Contract/contracts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

export default function Lottery({ account }) {
  const [lottaryContract, setLotteryContract] = useState(null);
  const [mintingContract, setMintingContract] = useState(null);
  const [isWhitelist, setIsWhitelist] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [apeList, setApeList] = useState([]);

  useEffect(() => {
    if (lottaryContract === null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const lcontract = new ethers.Contract(
        LOTTERY_CONTRACT_ADDRESS,
        lottery_contract_abi,
        provider.getSigner()
      );
      setLotteryContract(lcontract);
    }

    if (mintingContract === null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const mcontract = new ethers.Contract(
        MINTING_CONTRACT_ADDRESS,
        minting_contract_abi,
        provider.getSigner()
      );
      setMintingContract(mcontract);
    }
  }, []);

  useEffect(() => {
    if (lottaryContract !== null) {
      lottaryContract
        .owner()
        .then((admin) => {
          setIsAdmin(admin === account);
          return lottaryContract.getWhitelist();
        })
        .then((wl_addresses) => {
          setIsWhitelist(account in wl_addresses);
        });
    }
  }, [lottaryContract]);

  const enterLotteryHandler = async () => {
    try {
      const overridesObj = {
        value: "10000000000000000",
        gasLimit: 300000,
        gasPrice: null,
      };
      await lottaryContract.enter(overridesObj);
    } catch (err) {
      console.log(err.message);
    }
  };

  const pickWinnerHandler = async () => {
    try {
      await lottaryContract.pickWinner();
    } catch (err) {
      console.log(err.message);
    }
  };

  const mintApe = async () => {
    try {
      const overridesObj = {
        value: "100000000000000000",
        gasLimit: 300000,
        gasPrice: null,
      };
      await mintingContract.mint(overridesObj);
    } catch (err) {
      console.log(err.message);
    }
  };

  const showApes = async () => {
    try {
      const myapes = await mintingContract.listApes();
      setApeList(myapes);
    } catch (err) {
      console.log(err.message);
    }
  };

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
                  <Button variant="contained" onClick={mintApe}>
                    MINT NOW!
                  </Button>
                ) : (
                  <Tooltip title="Only Whitelisted Addresses can mint HOWAPEs">
                    <span>
                      <Button variant="contained" disabled>
                        MINT NOW!
                      </Button>
                    </span>
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
                  Enter the lottery by sending 0.01 AVAX
                </Typography>
                <Button variant="contained" onClick={enterLotteryHandler}>
                  Enter Lottery
                </Button>
              </Grid>
              <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  <b>Admin only:</b> Pick winner
                </Typography>
                {isAdmin ? (
                  <Button variant="contained" onClick={pickWinnerHandler}>
                    Pick Winner
                  </Button>
                ) : (
                  <Button variant="contained" disabled>
                    Pick Winner
                  </Button>
                )}
              </Grid>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item sx={{ height: 256 }}>
            <Typography variant="body2" color="text.secondary">
              My NFTs
            </Typography>
            {apeList &&
              apeList.length > 0 &&
              apeList.map((item) => {
                <div>{item}</div>;
              })}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
