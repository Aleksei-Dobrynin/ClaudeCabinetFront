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

type UserLoginHistoryTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseUserLoginHistoryView: FC<UserLoginHistoryTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="UserLoginHistoryForm" id="UserLoginHistoryForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="UserLoginHistory_TitleName">
                  {translate('label:UserLoginHistoryAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.startTime}
                      onChange={(event) => store.handleChange(event)}
                      name="startTime"
                      id='id_f_UserLoginHistory_startTime'
                      label={translate('label:UserLoginHistoryAddEditView.startTime')}
                      helperText={store.errors.startTime}
                      error={!!store.errors.startTime}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.endTime}
                      onChange={(event) => store.handleChange(event)}
                      name="endTime"
                      id='id_f_UserLoginHistory_endTime'
                      label={translate('label:UserLoginHistoryAddEditView.endTime')}
                      helperText={store.errors.endTime}
                      error={!!store.errors.endTime}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.authTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="authTypeId"
                      data={store.authTypes}
                      id='id_f_UserLoginHistory_authTypeId'
                      label={translate('label:UserLoginHistoryAddEditView.authTypeId')}
                      helperText={store.errors.authTypeId}
                      error={!!store.errors.authTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.ipAddress}
                      onChange={(event) => store.handleChange(event)}
                      name="ipAddress"
                      data-testid="id_f_UserLoginHistory_ipAddress"
                      id='id_f_UserLoginHistory_ipAddress'
                      label={translate('label:UserLoginHistoryAddEditView.ipAddress')}
                      helperText={store.errors.ipAddress}
                      error={!!store.errors.ipAddress}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.device}
                      onChange={(event) => store.handleChange(event)}
                      name="device"
                      data-testid="id_f_UserLoginHistory_device"
                      id='id_f_UserLoginHistory_device'
                      label={translate('label:UserLoginHistoryAddEditView.device')}
                      helperText={store.errors.device}
                      error={!!store.errors.device}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.browser}
                      onChange={(event) => store.handleChange(event)}
                      name="browser"
                      data-testid="id_f_UserLoginHistory_browser"
                      id='id_f_UserLoginHistory_browser'
                      label={translate('label:UserLoginHistoryAddEditView.browser')}
                      helperText={store.errors.browser}
                      error={!!store.errors.browser}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.os}
                      onChange={(event) => store.handleChange(event)}
                      name="os"
                      data-testid="id_f_UserLoginHistory_os"
                      id='id_f_UserLoginHistory_os'
                      label={translate('label:UserLoginHistoryAddEditView.os')}
                      helperText={store.errors.os}
                      error={!!store.errors.os}
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

export default BaseUserLoginHistoryView;
