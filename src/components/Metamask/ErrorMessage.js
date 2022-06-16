import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import './MetaMask.css'

export default function MediaCard({label, message}) {
  return (
    <Card sx={{ width: 450, marginTop: 5 }}>
      <CardContent>
        <Typography gutterBottom variant="h5">
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         {message}
        </Typography>
      </CardContent>
    </Card>

  );
}
