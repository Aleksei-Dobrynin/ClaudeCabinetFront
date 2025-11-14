import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type UserAuthMethodsTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseUserAuthMethodsView: FC<UserAuthMethodsTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="UserAuthMethodsForm" id="UserAuthMethodsForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="UserAuthMethods_TitleName">
                  {translate('label:UserAuthMethodsAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.authTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="authTypeId"
                      data={store.authTypes}
                      id='id_f_UserAuthMethods_authTypeId'
                      label={translate('label:UserAuthMethodsAddEditView.authTypeId')}
                      helperText={store.errors.authTypeId}
                      error={!!store.errors.authTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.authData}
                      onChange={(event) => store.handleChange(event)}
                      name="authData"
                      data-testid="id_f_UserAuthMethods_authData"
                      id='id_f_UserAuthMethods_authData'
                      label={translate('label:UserAuthMethodsAddEditView.authData')}
                      helperText={store.errors.authData}
                      error={!!store.errors.authData}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})

export default BaseUserAuthMethodsView;
