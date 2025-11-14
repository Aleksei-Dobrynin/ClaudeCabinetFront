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

type LanguageTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseLanguageView: FC<LanguageTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="LanguageForm" id="LanguageForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="Language_TitleName">
                  {translate('label:LanguageAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_Language_name"
                      id='id_f_Language_name'
                      label={translate('label:LanguageAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.nameKg}
                      onChange={(event) => store.handleChange(event)}
                      name="nameKg"
                      data-testid="id_f_Language_nameKg"
                      id='id_f_Language_nameKg'
                      label={translate('label:LanguageAddEditView.nameKg')}
                      helperText={store.errors.nameKg}
                      error={!!store.errors.nameKg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.descriptionKg}
                      onChange={(event) => store.handleChange(event)}
                      name="descriptionKg"
                      data-testid="id_f_Language_descriptionKg"
                      id='id_f_Language_descriptionKg'
                      label={translate('label:LanguageAddEditView.descriptionKg')}
                      helperText={store.errors.descriptionKg}
                      error={!!store.errors.descriptionKg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.textColor}
                      onChange={(event) => store.handleChange(event)}
                      name="textColor"
                      data-testid="id_f_Language_textColor"
                      id='id_f_Language_textColor'
                      label={translate('label:LanguageAddEditView.textColor')}
                      helperText={store.errors.textColor}
                      error={!!store.errors.textColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.backgroundColor}
                      onChange={(event) => store.handleChange(event)}
                      name="backgroundColor"
                      data-testid="id_f_Language_backgroundColor"
                      id='id_f_Language_backgroundColor'
                      label={translate('label:LanguageAddEditView.backgroundColor')}
                      helperText={store.errors.backgroundColor}
                      error={!!store.errors.backgroundColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_Language_description"
                      id='id_f_Language_description'
                      label={translate('label:LanguageAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_Language_code"
                      id='id_f_Language_code'
                      label={translate('label:LanguageAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.isdefault}
                      onChange={(event) => store.handleChange(event)}
                      name="isdefault"
                      label={translate('label:LanguageAddEditView.isdefault')}
                      id='id_f_Language_isdefault'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.queuenumber}
                      onChange={(event) => store.handleChange(event)}
                      name="queuenumber"
                      data-testid="id_f_Language_queuenumber"
                      id='id_f_Language_queuenumber'
                      label={translate('label:LanguageAddEditView.queuenumber')}
                      helperText={store.errors.queuenumber}
                      error={!!store.errors.queuenumber}
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

export default BaseLanguageView;
