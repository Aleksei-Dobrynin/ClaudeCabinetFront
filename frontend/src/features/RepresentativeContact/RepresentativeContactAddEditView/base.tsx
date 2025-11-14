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

type RepresentativeContactTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseRepresentativeContactView: FC<RepresentativeContactTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="RepresentativeContactForm" id="RepresentativeContactForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="RepresentativeContact_TitleName">
                  {translate('label:RepresentativeContactAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.value}
                      onChange={(event) => store.handleChange(event)}
                      name="value"
                      data-testid="id_f_RepresentativeContact_value"
                      id='id_f_RepresentativeContact_value'
                      label={translate('label:RepresentativeContactAddEditView.value')}
                      helperText={store.errors.value}
                      error={!!store.errors.value}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.allowNotification}
                      onChange={(event) => store.handleChange(event)}
                      name="allowNotification"
                      label={translate('label:RepresentativeContactAddEditView.allowNotification')}
                      id='id_f_RepresentativeContact_allowNotification'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="rTypeId"
                      data-testid="id_f_RepresentativeContact_rTypeId"
                      id='id_f_RepresentativeContact_rTypeId'
                      label={translate('label:RepresentativeContactAddEditView.rTypeId')}
                      helperText={store.errors.rTypeId}
                      error={!!store.errors.rTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.representativeId}
                      onChange={(event) => store.handleChange(event)}
                      name="representativeId"
                      data={store.representatives}
                      id='id_f_RepresentativeContact_representativeId'
                      label={translate('label:RepresentativeContactAddEditView.representativeId')}
                      helperText={store.errors.representativeId}
                      error={!!store.errors.representativeId}
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

export default BaseRepresentativeContactView;
