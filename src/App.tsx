import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { CryptoBlock } from './components/CryptoBlock';

function App() {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h2" component="h2" gutterBottom>
          Crypto Blocks
        </Typography>
        <CryptoBlock />
      </Box>
    </Container>
  );
}

export default App;
