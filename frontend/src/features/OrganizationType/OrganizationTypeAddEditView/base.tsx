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

type OrganizationTypeTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseOrganizationTypeView: FC<OrganizationTypeTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="OrganizationTypeForm" id="OrganizationTypeForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="OrganizationType_TitleName">
                  {translate('label:OrganizationTypeAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.descriptionKg}
                      onChange={(event) => store.handleChange(event)}
                      name="descriptionKg"
                      data-testid="id_f_OrganizationType_descriptionKg"
                      id='id_f_OrganizationType_descriptionKg'
                      label={translate('label:OrganizationTypeAddEditView.descriptionKg')}
                      helperText={store.errors.descriptionKg}
                      error={!!store.errors.descriptionKg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.textColor}
                      onChange={(event) => store.handleChange(event)}
                      name="textColor"
                      data-testid="id_f_OrganizationType_textColor"
                      id='id_f_OrganizationType_textColor'
                      label={translate('label:OrganizationTypeAddEditView.textColor')}
                      helperText={store.errors.textColor}
                      error={!!store.errors.textColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.backgroundColor}
                      onChange={(event) => store.handleChange(event)}
                      name="backgroundColor"
                      data-testid="id_f_OrganizationType_backgroundColor"
                      id='id_f_OrganizationType_backgroundColor'
                      label={translate('label:OrganizationTypeAddEditView.backgroundColor')}
                      helperText={store.errors.backgroundColor}
                      error={!!store.errors.backgroundColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_OrganizationType_name"
                      id='id_f_OrganizationType_name'
                      label={translate('label:OrganizationTypeAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_OrganizationType_description"
                      id='id_f_OrganizationType_description'
                      label={translate('label:OrganizationTypeAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_OrganizationType_code"
                      id='id_f_OrganizationType_code'
                      label={translate('label:OrganizationTypeAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.nameKg}
                      onChange={(event) => store.handleChange(event)}
                      name="nameKg"
                      data-testid="id_f_OrganizationType_nameKg"
                      id='id_f_OrganizationType_nameKg'
                      label={translate('label:OrganizationTypeAddEditView.nameKg')}
                      helperText={store.errors.nameKg}
                      error={!!store.errors.nameKg}
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

export default BaseOrganizationTypeView;
