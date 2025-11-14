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

type ApplicationStatusHistoryTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseApplicationStatusHistoryView: FC<ApplicationStatusHistoryTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="ApplicationStatusHistoryForm" id="ApplicationStatusHistoryForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="ApplicationStatusHistory_TitleName">
                  {translate('label:ApplicationStatusHistoryAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.statusId}
                      onChange={(event) => store.handleChange(event)}
                      name="statusId"
                      data={store.applicationStatuses}
                      id='id_f_ApplicationStatusHistory_statusId'
                      label={translate('label:ApplicationStatusHistoryAddEditView.statusId')}
                      helperText={store.errors.statusId}
                      error={!!store.errors.statusId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.oldStatusId}
                      onChange={(event) => store.handleChange(event)}
                      name="oldStatusId"
                      data={store.applicationStatuses}
                      id='id_f_ApplicationStatusHistory_oldStatusId'
                      label={translate('label:ApplicationStatusHistoryAddEditView.oldStatusId')}
                      helperText={store.errors.oldStatusId}
                      error={!!store.errors.oldStatusId}
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

export default BaseApplicationStatusHistoryView;
