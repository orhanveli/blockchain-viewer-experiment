import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import { Transaction } from 'web3-eth';

import { web3Instance } from '../utils/web3.utils';
import { makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { unstable_batchedUpdates } from 'react-dom';

interface TransactionsTableProps {
  count: number;
  blockNumber: number;
  running: boolean;
}

const useStyles = makeStyles({
  truncatedCell: {
    width: 300
  }
});

export function TransactionsTable({
  count,
  blockNumber,
  running
}: TransactionsTableProps) {
  const classes = useStyles();

  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const getTransactions = async () => {
    if (!blockNumber || !count || count === 0) {
      return;
    }
    setLoading(true);
    try {
      const rows: Transaction[] = [];
      for (let i = 0; i < count; i++) {
        const row = await web3Instance.eth.getTransactionFromBlock(
          blockNumber,
          i
        );
        rows.push(row);
      }
      unstable_batchedUpdates(() => {
        setErr('');
        setRows(rows.sort((a, b) => Number(b.value) - Number(a.value)));
      });
    } catch (error) {
      setErr(error.toString());
    }
    setLoading(false);
  };

  const handleClick = () => {
    if (running) {
      setErr('To fetch transactions, you should pause the execution!');
      return;
    }
    getTransactions();
  };

  const RenderTable = () => {
    if (rows.length === 0) {
      return (
        <>
          <Button
            onClick={handleClick}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Transactions'}
          </Button>
        </>
      );
    }

    return (
      <TableContainer component={Box}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell align="left">Amount</TableCell>
              <TableCell align="left" className={classes.truncatedCell}>
                Hash
              </TableCell>
              <TableCell align="left" className={classes.truncatedCell}>
                From
              </TableCell>
              <TableCell align="left" className={classes.truncatedCell}>
                To
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.hash}>
                <TableCell>{row.transactionIndex}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell className={classes.truncatedCell}>
                  {row.hash}
                </TableCell>
                <TableCell className={classes.truncatedCell}>
                  {row.from}
                </TableCell>
                <TableCell className={classes.truncatedCell}>
                  {row.to}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const RenderError = () => {
    if (!err) {
      return null;
    }
    return <Alert severity="error">{err}</Alert>;
  };

  return (
    <>
      <RenderError />
      <RenderTable />
    </>
  );
}
