import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Header({button}) {

  return (
    <Box sx={{ width: 1/1 }}>
      <AppBar style={{ background: '#006cff'}} position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HOWAPE Lottery
          </Typography>
        {button}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
