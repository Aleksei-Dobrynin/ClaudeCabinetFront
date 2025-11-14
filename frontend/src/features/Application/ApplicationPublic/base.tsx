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

type ApplicationTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseApplicationView: FC<ApplicationTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="ApplicationForm" id="ApplicationForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="Application_TitleName">
                  {translate('label:ApplicationAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.archObjectId}
                      onChange={(event) => store.handleChange(event)}
                      name="archObjectId"
                      data={store.archObjects}
                      id='id_f_Application_archObjectId'
                      label={translate('label:ApplicationAddEditView.archObjectId')}
                      helperText={store.errors.archObjectId}
                      error={!!store.errors.archObjectId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.workDescription}
                      onChange={(event) => store.handleChange(event)}
                      name="workDescription"
                      data-testid="id_f_Application_workDescription"
                      id='id_f_Application_workDescription'
                      label={translate('label:ApplicationAddEditView.workDescription')}
                      helperText={store.errors.workDescription}
                      multiline
                      rows={3}
                      error={!!store.errors.workDescription}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.statusId}
                      onChange={(event) => store.handleChange(event)}
                      name="statusId"
                      data={store.applicationStatuses}
                      id='id_f_Application_statusId'
                      label={translate('label:ApplicationAddEditView.statusId')}
                      helperText={store.errors.statusId}
                      error={!!store.errors.statusId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.companyId}
                      onChange={(event) => store.handleChange(event)}
                      name="companyId"
                      data={store.customers}
                      id='id_f_Application_companyId'
                      label={translate('label:ApplicationAddEditView.companyId')}
                      helperText={store.errors.companyId}
                      error={!!store.errors.companyId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rServiceId}
                      onChange={(event) => store.handleChange(event)}
                      name="rServiceId"
                      data-testid="id_f_Application_rServiceId"
                      id='id_f_Application_rServiceId'
                      label={translate('label:ApplicationAddEditView.rServiceId')}
                      helperText={store.errors.rServiceId}
                      error={!!store.errors.rServiceId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rServiceName}
                      onChange={(event) => store.handleChange(event)}
                      name="rServiceName"
                      data-testid="id_f_Application_rServiceName"
                      id='id_f_Application_rServiceName'
                      label={translate('label:ApplicationAddEditView.rServiceName')}
                      helperText={store.errors.rServiceName}
                      error={!!store.errors.rServiceName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.uniqueCode}
                      onChange={(event) => store.handleChange(event)}
                      name="uniqueCode"
                      data-testid="id_f_Application_uniqueCode"
                      id='id_f_Application_uniqueCode'
                      label={translate('label:ApplicationAddEditView.uniqueCode')}
                      helperText={store.errors.uniqueCode}
                      error={!!store.errors.uniqueCode}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.registrationDate}
                      onChange={(event) => store.handleChange(event)}
                      name="registrationDate"
                      id='id_f_Application_registrationDate'
                      label={translate('label:ApplicationAddEditView.registrationDate')}
                      helperText={store.errors.registrationDate}
                      error={!!store.errors.registrationDate}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.deadline}
                      onChange={(event) => store.handleChange(event)}
                      name="deadline"
                      id='id_f_Application_deadline'
                      label={translate('label:ApplicationAddEditView.deadline')}
                      helperText={store.errors.deadline}
                      error={!!store.errors.deadline}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.number}
                      onChange={(event) => store.handleChange(event)}
                      name="number"
                      data-testid="id_f_Application_number"
                      id='id_f_Application_number'
                      label={translate('label:ApplicationAddEditView.number')}
                      helperText={store.errors.number}
                      error={!!store.errors.number}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.comment}
                      onChange={(event) => store.handleChange(event)}
                      name="comment"
                      data-testid="id_f_Application_comment"
                      id='id_f_Application_comment'
                      label={translate('label:ApplicationAddEditView.comment')}
                      helperText={store.errors.comment}
                      error={!!store.errors.comment}
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

export default BaseApplicationView;