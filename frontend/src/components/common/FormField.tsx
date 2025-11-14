import React, { FC, ReactNode } from 'react';
import { Grid } from '@mui/material';
import { observer } from "mobx-react";

interface FormFieldProps {
  children: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  spacing?: number;
}

/**
 * A wrapper component for form fields with standardized layout
 */
const FormField: FC<FormFieldProps> = observer(({
                                                  children,
                                                  xs = 12,
                                                  sm,
                                                  md = 6,
                                                  lg,
                                                  spacing = 0
                                                }) => {
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg} spacing={spacing}>
      {children}
    </Grid>
  );
});

export default FormField;