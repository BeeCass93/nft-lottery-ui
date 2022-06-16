import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PaidIcon from '@mui/icons-material/Paid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MapIcon from '@mui/icons-material/Map';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

export default function Lottery() {
  const [web3, setWeb3] = useState();
  const [address, setAddress] = useState();
  const [lcContract, setLcContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();
  const [lotteryPlayers, setPlayers] = useState([]);
  const [lotteryHistory, setLotteryHistory] = useState([]);
  const [lotteryId, setLotteryId] = useState();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    updateState();
  }, [lcContract]);

  const updateState = () => {
    if (lcContract) getPot();
    if (lcContract) getPlayers();
    if (lcContract) getLotteryId();
  };

  const getPot = async () => {
    const pot = await lcContract.methods.getBalance().call();
    setLotteryPot(web3.utils.fromWei(pot, "ether"));
  };

  const getPlayers = async () => {
    const players = await lcContract.methods.getPlayers().call();
    setPlayers(players);
  };

  const getHistory = async (id) => {
    setLotteryHistory([]);
    for (let i = parseInt(id); i > 0; i--) {
      const winnerAddress = await lcContract.methods.lotteryHistory(i).call();
      const historyObj = {};
      historyObj.id = i;
      historyObj.address = winnerAddress;
      setLotteryHistory((lotteryHistory) => [...lotteryHistory, historyObj]);
    }
  };

  const getLotteryId = async () => {
    const lotteryId = await lcContract.methods.lotteryId().call();
    setLotteryId(lotteryId);
    await getHistory(lotteryId);
  };

  const enterLotteryHandler = async () => {
    setError("");
    setSuccessMsg("");
    try {
      await lcContract.methods.enter().send({
        from: address,
        value: "15000000000000000",
        gas: 300000,
        gasPrice: null,
      });
      updateState();
    } catch (err) {
      setError(err.message);
    }
  };

  const pickWinnerHandler = async () => {
    setError("");
    setSuccessMsg("");
    console.log(`address from pick winner :: ${address}`);
    try {
      await lcContract.methods.pickWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const payWinnerHandler = async () => {
    setError("");
    setSuccessMsg("");
    try {
      await lcContract.methods.payWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      });
      console.log(`lottery id :: ${lotteryId}`);
      const winnerAddress = await lcContract.methods
        .lotteryHistory(lotteryId)
        .call();
      setSuccessMsg(`The winner is ${winnerAddress}`);
      updateState();
    } catch (err) {
      setError(err.message);
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
              <ListItemText primary="MINT DATE: tbc" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PaidIcon />
              </ListItemIcon>
              <ListItemText primary="MINT PRICE: tbc" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="ROAD MAP: tbc" />
            </ListItemButton>
          </ListItem>
        </List>
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
              <Button variant="contained"
                onClick={enterLotteryHandler}
              >
                Enter Lottery
              </Button>
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="text.secondary">
                <b>Admin only:</b> Pick winner
              </Typography>
              <Button variant="contained"
                onClick={pickWinnerHandler}
              >
                Pick Winner
              </Button>
            </Grid>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item sx={{ height: 256 }}>
            <Typography variant="body2" color="text.secondary">
              Lottery History
            </Typography>
            {lotteryHistory &&
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
              })}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
