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
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ListIcon from "@mui/icons-material/List";
import Tooltip from "@mui/material/Tooltip";
import { ethers } from "ethers";
import {
  LOTTERY_CONTRACT_ADDRESS,
  MINTING_CONTRACT_ADDRESS,
  lottery_contract_abi,
  minting_contract_abi,
} from "../Contract/contracts";
import NftCard from './nftCard';
import axios from "axios";

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
  const [balance, setBalance] = useState();
  const [numberOfEntries, setnumberOfEntries] = useState(0);

  const hexToDecimal = (hex) => {
    const decimal = Math.round(parseInt(hex, 16) * 100) / 100;
    return decimal;
  };

  const weiHexToDecimal = (hex) => {
    const decimal =
      Math.round((parseInt(hex, 16) * 100) / 1000000000000000000) / 100;
    return decimal;
  };

  useEffect(() => {
    setApeList([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lottaryContract !== null) {
      lottaryContract
        .owner()
        .then((admin) => {
          setIsAdmin(admin.toLowerCase() === account);
          return lottaryContract.checkIfWhitelisted(account);
        })
        .then((isWhitelisted) => {
          setIsWhitelist(isWhitelisted);
          return lottaryContract.getBalance();
        })
        .then((balance) => {
          setBalance(weiHexToDecimal(balance._hex));
          return lottaryContract.numberOfEntries(account);
        })
        .then((entries) => {
          setnumberOfEntries(hexToDecimal(entries._hex));
          setOwnerApes();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        value: "10000000000000000",
        gasLimit: 300000,
        gasPrice: null,
      };
      await mintingContract.mint(overridesObj);
    } catch (err) {
      console.log(err.message);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const setOwnerApes = async () => {
    const apeIdList = [];
    for (let i = 1; i <= 10; i++) {
      try {
        const owner = await mintingContract.ownerOf(i);
        if (owner.toLowerCase() === account) {
          apeIdList.push(i);
        }
      } catch (err) {
        break;
      }
    }

    for (let id of apeIdList) {
      mintingContract
        .tokenURI(id)
        .then((url) => {
          return axios.get(url);
        })
        .then((resp) => {
          const img_data = {
            url: resp.data.image,
            name: resp.data.name,
            description: resp.data.description,
            id: resp.data.tokenId,
            background: resp.data.attributes.filter((x) => {
              return x.trait_type === "Background";
            })[0].value,
            border: resp.data.attributes.filter((x) => {
              return x.trait_type === "Border";
            })[0].value,
            hat: resp.data.attributes.filter((x) => {
              return x.trait_type === "Hat";
            })[0].value,
            ornament: resp.data.attributes.filter((x) => {
              return x.trait_type === "Ornament";
            })[0].value,
          };
          setApeList((apeList) => [...apeList, img_data]);
        });
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
              HowApe Lottery is a lottery to get a chance for a whitelist when
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
            <Grid item xs container direction="column" spacing={3}>
              <Grid item xs>
                <Typography variant="h5" color="text.secondary">
                  <b>Total Lottery Jackpot: {balance} AVAX</b>
                </Typography>
              </Grid>
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
                  Number of times played with lottery: {numberOfEntries}
                </Typography>
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
            <ImageList sx={{  height: 200 }} cols={1} rowHeight={180}>
            {
              apeList.map((item) => {
                return (
                  <ImageListItem key={item.id}>
                <NftCard item={item}></NftCard>
                </ImageListItem>

                );
              })}
</ImageList>


          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
