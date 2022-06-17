import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function NftCard({ item }) {
  return (
    <Card sx={{ display: "flex", border: "1px solid grey" }}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={item.url}
        alt={item.id}
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            HowApe #{item.id}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {item.name}{" "}
            <Tooltip title={item.description}>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <Typography variant="body2" color="text.secondary">
          <Stack direction="row" spacing={1}>
          <Stack direction="column" spacing={1}>
      <Chip label={"Background: " + item.background} variant="outlined" />
      <Chip label={"Ornament: " + item.ornament} variant="outlined" />
      </Stack>
      <Stack direction="column" spacing={1}>
      <Chip label={"Border: " + item.border} variant="outlined" />
      <Chip label={"Hat: " + item.hat} variant="outlined" />
    </Stack>
    </Stack>
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
