import React, { FC, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container
} from '@mui/material';
import { observer } from "mobx-react";

interface BaseFormProps {
  title: string;
  children: ReactNode;
  formId?: string;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  marginTop?: number;
  titleId?: string;
}

/**
 * A base form component with standard layout and styling
 */
const BaseForm: FC<BaseFormProps> = observer(({
                                                title,
                                                children,
                                                formId = 'baseForm',
                                                actions,
                                                maxWidth = 'xl',
                                                marginTop = 20,
                                                titleId
                                              }) => {
  return (
    <Container maxWidth={maxWidth} style={{ marginTop }}>
      <Grid container>
        <form id={formId} autoComplete='off' style={{ width: '100%' }}>
          <Paper elevation={7}>
            <Card>
              <CardHeader
                title={
                  <span id={titleId}>
                    {title}
                  </span>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {children}
                </Grid>
              </CardContent>
              {actions && (
                <>
                  <Divider />
                  <CardContent>
                    {actions}
                  </CardContent>
                </>
              )}
            </Card>
          </Paper>
        </form>
      </Grid>
    </Container>
  );
});

export default BaseForm;