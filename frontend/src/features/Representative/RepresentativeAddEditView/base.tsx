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
import PhoneInputWithCountry from 'components/PhoneField';
import MaskedTextField from "components/MaskedTextField";


type RepresentativeTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseRepresentativeView: FC<RepresentativeTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="RepresentativeForm" id="RepresentativeForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="Representative_TitleName">
                  {translate('label:RepresentativeAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.lastName}
                      onChange={(event) => store.handleChange(event)}
                      name="lastName"
                      data-testid="id_f_Representative_lastName"
                      id='id_f_Representative_lastName'
                      label={translate('label:RepresentativeAddEditView.lastName')}
                      helperText={store.errors.lastName}
                      error={!!store.errors.lastName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.firstName}
                      onChange={(event) => store.handleChange(event)}
                      name="firstName"
                      data-testid="id_f_Representative_firstName"
                      id='id_f_Representative_firstName'
                      label={translate('label:RepresentativeAddEditView.firstName')}
                      helperText={store.errors.firstName}
                      error={!!store.errors.firstName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.secondName}
                      onChange={(event) => store.handleChange(event)}
                      name="secondName"
                      data-testid="id_f_Representative_secondName"
                      id='id_f_Representative_secondName'
                      label={translate('label:RepresentativeAddEditView.secondName')}
                      helperText={store.errors.secondName}
                      error={!!store.errors.secondName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <MaskedTextField
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                      data-testid="id_f_Representative_pin"
                      id='id_f_Representative_pin'
                      label={translate('label:RepresentativeAddEditView.pin')}
                      mask={"00000000000000"}
                      helperText={store.errors.pin}
                      error={!!store.errors.pin}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.hasAccess}
                      onChange={(event) => store.handleChange(event)}
                      name="hasAccess"
                      label={translate('label:RepresentativeAddEditView.hasAccess')}
                      id='id_f_Representative_hasAccess'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.typeId}
                      onChange={(event) => store.handleChange(event)}
                      name="typeId"
                      data={store.representativeTypes}
                      id='id_f_Representative_typeId'
                      label={translate('label:RepresentativeAddEditView.typeId')}
                      helperText={store.errors.typeId}
                      error={!!store.errors.typeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <PhoneInputWithCountry
                      value={store.phone}
                      onChange={(value) => store.handleChange({ target: { value: value, name: "phone" } })}
                      data-testid="id_f_Representative_phone"
                      id='id_f_Representative_phone'
                      label={translate('label:RepresentativeAddEditView.phone')}
                      helperText={store.errors.phone}
                      error={!!store.errors.phone}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.email}
                      onChange={(event) => store.handleChange(event)}
                      name="email"
                      data-testid="id_f_Representative_email"
                      id='id_f_Representative_email'
                      label={translate('label:RepresentativeAddEditView.email')}
                      helperText={store.errors.email}
                      error={!!store.errors.email}
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

export default BaseRepresentativeView;
