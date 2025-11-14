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

type NotificationTemplateTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseNotificationTemplateView: FC<NotificationTemplateTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="NotificationTemplateForm" id="NotificationTemplateForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="NotificationTemplate_TitleName">
                  {translate('label:NotificationTemplateAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.subject}
                      onChange={(event) => store.handleChange(event)}
                      name="subject"
                      data-testid="id_f_NotificationTemplate_subject"
                      id='id_f_NotificationTemplate_subject'
                      label={translate('label:NotificationTemplateAddEditView.subject')}
                      helperText={store.errors.subject}
                      error={!!store.errors.subject}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.body}
                      onChange={(event) => store.handleChange(event)}
                      name="body"
                      data-testid="id_f_NotificationTemplate_body"
                      id='id_f_NotificationTemplate_body'
                      label={translate('label:NotificationTemplateAddEditView.body')}
                      helperText={store.errors.body}
                      error={!!store.errors.body}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.contactTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="contactTypeId"
                      data={store.contactTypes}
                      data-testid="id_f_NotificationTemplate_contactTypeId"
                      id='id_f_NotificationTemplate_contactTypeId'
                      label={translate('label:NotificationTemplateAddEditView.contactTypeId')}
                      helperText={store.errors.contactTypeId}
                      error={!!store.errors.contactTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_NotificationTemplate_code"
                      id='id_f_NotificationTemplate_code'
                      label={translate('label:NotificationTemplateAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.placeholders}
                      onChange={(event) => store.handleChange(event)}
                      name="placeholders"
                      data-testid="id_f_NotificationTemplate_placeholders"
                      id='id_f_NotificationTemplate_placeholders'
                      label={translate('label:NotificationTemplateAddEditView.placeholders')}
                      helperText={store.errors.placeholders}
                      error={!!store.errors.placeholders}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.link}
                      onChange={(event) => store.handleChange(event)}
                      name="link"
                      data-testid="id_f_NotificationTemplate_link"
                      id='id_f_NotificationTemplate_link'
                      label={translate('label:NotificationTemplateAddEditView.link')}
                      helperText={store.errors.link}
                      error={!!store.errors.link}
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

export default BaseNotificationTemplateView;
