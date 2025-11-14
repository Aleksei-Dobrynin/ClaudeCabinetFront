import React, { FC, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Button,
  makeStyles,
  FormControlLabel,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";

type CustomerContactAddEditProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<CustomerContactAddEditProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>

      <form id="CustomerContactForm" autoComplete='off'>
        <Paper elevation={7}  >
          <Card>
            <CardHeader title={
              <span id="CustomerContact_TitleName">
                {translate('label:CustomerContactAddEditView.entityTitle')}
              </span>
            } />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <CustomTextField
                    helperText={store.errors.name}
                    error={!!store.errors.name}
                    id='id_f_CustomerContact_name'
                    label={translate('label:CustomerContactAddEditView.name')}
                    value={store.name}
                    onChange={(event) => store.handleChange(event)}
                    name="name"
                  />
                </Grid>
             
              </Grid>
            </CardContent>
          </Card>
        </Paper>
      </form>
      {props.children}
    </Container>
  );
})


export default BaseView;
