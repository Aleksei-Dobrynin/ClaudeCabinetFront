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

type ServiceAddEditProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};


const BaseView: FC<ServiceAddEditProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' style={{ marginTop: 20 }}>

      <form id="ServiceForm" autoComplete='off'>
        <Paper elevation={7}  >
          <Card>
            <CardHeader title={
              <span id="Service_TitleName">
                {translate('label:ServiceAddEditView.entityTitle')}
              </span>
            } />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <CustomTextField
                    helperText={store.errors.name}
                    error={!!store.errors.name}
                    id='id_f_Service_name'
                    label={translate('label:ServiceAddEditView.name')}
                    value={store.name}
                    onChange={(event) => store.handleChange(event)}
                    name="name"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <CustomTextField
                    helperText={store.errors.short_name}
                    error={!!store.errors.short_name}
                    id='id_f_Service_short_name'
                    label={translate('label:ServiceAddEditView.short_name')}
                    value={store.short_name}
                    onChange={(event) => store.handleChange(event)}
                    name="short_name"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <CustomTextField
                    helperText={store.errors.code}
                    error={!!store.errors.code}
                    id='id_f_Service_code'
                    label={translate('label:ServiceAddEditView.code')}
                    value={store.code}
                    onChange={(event) => store.handleChange(event)}
                    name="code"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <CustomTextField
                    helperText={store.errors.description}
                    error={!!store.errors.description}
                    id='id_f_Service_description'
                    label={translate('label:ServiceAddEditView.description')}
                    value={store.description}
                    onChange={(event) => store.handleChange(event)}
                    name="description"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <CustomTextField
                    helperText={store.errors.day_count}
                    error={!!store.errors.day_count}
                    id='id_f_Service_day_count'
                    label={translate('label:ServiceAddEditView.day_count')}
                    type="number"
                    value={store.day_count}
                    onChange={(event) => store.handleChange(event)}
                    name="day_count"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <CustomTextField
                    helperText={store.errors.price}
                    error={!!store.errors.price}
                    id='id_f_Service_price'
                    label={translate('label:ServiceAddEditView.price')}
                    value={store.price}
                    type="number"
                    onChange={(event) => store.handleChange(event)}
                    name="price"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <LookUp
                    value={store.workflow_id}
                    onChange={(event) => store.handleChange(event)}
                    name="workflow_id"
                    data={store.Workflows}
                    id='id_f_Service_workflow_id'
                    label={translate('label:ServiceAddEditView.workflow_id')}
                    helperText={store.errors.workflow_id}
                    error={!!store.errors.workflow_id}
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
