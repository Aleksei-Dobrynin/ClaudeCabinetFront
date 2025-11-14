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

type NotificationLogTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseNotificationLogView: FC<NotificationLogTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="NotificationLogForm" id="NotificationLogForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="NotificationLog_TitleName">
                  {translate('label:NotificationLogAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.text}
                      onChange={(event) => store.handleChange(event)}
                      name="text"
                      data-testid="id_f_NotificationLog_text"
                      id='id_f_NotificationLog_text'
                      label={translate('label:NotificationLogAddEditView.text')}
                      helperText={store.errors.text}
                      error={!!store.errors.text}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.title}
                      onChange={(event) => store.handleChange(event)}
                      name="title"
                      data-testid="id_f_NotificationLog_title"
                      id='id_f_NotificationLog_title'
                      label={translate('label:NotificationLogAddEditView.title')}
                      helperText={store.errors.title}
                      error={!!store.errors.title}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.applicationId}
                      onChange={(event) => store.handleChange(event)}
                      name="applicationId"
                      data={store.applications}
                      id='id_f_NotificationLog_applicationId'
                      label={translate('label:NotificationLogAddEditView.applicationId')}
                      helperText={store.errors.applicationId}
                      error={!!store.errors.applicationId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.contact}
                      onChange={(event) => store.handleChange(event)}
                      name="contact"
                      data-testid="id_f_NotificationLog_contact"
                      id='id_f_NotificationLog_contact'
                      label={translate('label:NotificationLogAddEditView.contact')}
                      helperText={store.errors.contact}
                      error={!!store.errors.contact}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.dateSend}
                      onChange={(event) => store.handleChange(event)}
                      name="dateSend"
                      data-testid="id_f_NotificationLog_dateSend"
                      id='id_f_NotificationLog_dateSend'
                      label={translate('label:NotificationLogAddEditView.dateSend')}
                      helperText={store.errors.dateSend}
                      error={!!store.errors.dateSend}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rContactTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="rContactTypeId"
                      data-testid="id_f_NotificationLog_rContactTypeId"
                      id='id_f_NotificationLog_rContactTypeId'
                      label={translate('label:NotificationLogAddEditView.rContactTypeId')}
                      helperText={store.errors.rContactTypeId}
                      error={!!store.errors.rContactTypeId}
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

export default BaseNotificationLogView;
