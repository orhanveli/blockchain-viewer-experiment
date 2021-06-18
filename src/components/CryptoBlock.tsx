/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

import Paper from '@material-ui/core/Paper';
import { BlockTransactionString } from 'web3-eth';

import { web3Instance } from '../utils/web3.utils';
import { GridRow } from './GridRow';
import { TransactionsTable } from './TransactionsTable';

import './CryptoBlock.css';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  blockContainer: {
    padding: '1em'
  },
  infoContainer: {
    marginBottom: '1em'
  },
  actionsContainer: {
    margin: '2em 0'
  }
});

export function CryptoBlock() {
  const classes = useStyles();

  const [latestBlock, setLatestBlock] = useState<BlockTransactionString | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [subscr, setSubscr] = useState<any>(null);
  const [running, setRunning] = useState(false);

  const getLatestBlock = async (blockNo: number | 'latest') => {
    setLoading(true);
    try {
      const latest = await web3Instance.eth.getBlock(blockNo);
      setLatestBlock(latest);
    } catch (error) {
      setErr(error.toString());
    }
    setLoading(false);
  };

  const setSubscription = () => {
    const subscription = web3Instance.eth
      .subscribe('newBlockHeaders')
      .on('connected', function (/* subscriptionId */) {
        setRunning(true);
      })
      .on('data', async function (blockHeader) {
        // console.log({blockHeader});
        await getLatestBlock(blockHeader.number);
      })
      .on('error', (err) => {
        setErr(err.message);
        setRunning(false);
      });
    setSubscr(subscription);
  };

  useEffect(() => {
    getLatestBlock('latest').then(() => {
      setSubscription();
    });
    return () => {
      // unsubscribes the subscription
      if (subscr) {
        subscr.unsubscribe();
      }
    };
  }, []);

  const handleToggle = () => {
    if (running && subscr) {
      subscr.unsubscribe();
      setRunning(false);
      return;
    }
    setSubscription();
  };

  const handleClose = () => {
    setErr('');
  };

  const RenderError = () => (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      open={err !== ''}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert severity="error">{err}</Alert>
    </Snackbar>
  );

  const RenderTransactionsTable = () => {
    if (!latestBlock) {
      return null;
    }

    return (
      <>
        <Typography variant="h4" component="h4" gutterBottom>
          Transactions
        </Typography>

        <TransactionsTable
          count={latestBlock.transactions.length}
          running={running}
          blockNumber={latestBlock.number}
        />
      </>
    );
  };

  const RenderBlock = () => {
    if (!latestBlock) {
      return <Typography>No block!</Typography>;
    }

    return (
      <>
        <Grid
          container
          spacing={3}
          className={`${classes.infoContainer} highlight`}
        >
          <GridRow>
            <Grid item xs={4}>
              <strong>Block Number</strong>
            </Grid>
            <Grid item xs={8}>
              {latestBlock.number}
            </Grid>
          </GridRow>
          <GridRow>
            <Grid item xs={4}>
              <strong>Transactions Count</strong>
            </Grid>
            <Grid item xs={8}>
              {latestBlock.transactions.length}
            </Grid>
          </GridRow>
          <GridRow>
            <Grid item xs={4}>
              <strong>Miner</strong>
            </Grid>
            <Grid item xs={8}>
              <a
                href={`https://ethpool.org/miners/${latestBlock.miner}/dashboard`}
                target="_blank"
              >
                {latestBlock.miner}
              </a>
            </Grid>
          </GridRow>
          <GridRow>
            <Grid item xs={4}>
              <strong>Total Dificulty</strong>
            </Grid>
            <Grid item xs={8}>
              {latestBlock.totalDifficulty}
            </Grid>
          </GridRow>
        </Grid>
      </>
    );
  };

  const RenderLoading = () => <CircularProgress />;

  return (
    <div>
      <Paper className={classes.blockContainer}>
        <Typography variant="h3" component="h3" gutterBottom>
          Latest Block
        </Typography>
        <Grid
          container
          alignItems="center"
          className={classes.actionsContainer}
        >
          <Grid item xs={2}>
            <Button
              variant="outlined"
              color={running ? 'secondary' : 'primary'}
              onClick={handleToggle}
            >
              {running ? 'Pause' : 'Start'}
            </Button>
          </Grid>
          <Grid item xs={10}>
            <Typography>{running ? 'Checking....' : null}</Typography>
          </Grid>
        </Grid>
        {loading ? <RenderLoading /> : <RenderBlock />}
        <RenderTransactionsTable />
      </Paper>
      <RenderError />
    </div>
  );
}
