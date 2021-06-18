import React, { PropsWithChildren } from 'react';
import Grid, { GridProps } from '@material-ui/core/Grid';

export function GridRow({ children, ...rest }: PropsWithChildren<GridProps>) {
  return (
    <Grid item xs={12}>
      <Grid container {...rest}>
        {children}
      </Grid>
    </Grid>
  );
}
