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

type SDocumenttemplateTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseSDocumenttemplateView: FC<SDocumenttemplateTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="SDocumenttemplateForm" id="SDocumenttemplateForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="SDocumenttemplate_TitleName">
                  {translate('label:SDocumenttemplateAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.nameKg}
                      onChange={(event) => store.handleChange(event)}
                      name="nameKg"
                      data-testid="id_f_SDocumenttemplate_nameKg"
                      id='id_f_SDocumenttemplate_nameKg'
                      label={translate('label:SDocumenttemplateAddEditView.nameKg')}
                      helperText={store.errors.nameKg}
                      error={!!store.errors.nameKg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.descriptionKg}
                      onChange={(event) => store.handleChange(event)}
                      name="descriptionKg"
                      data-testid="id_f_SDocumenttemplate_descriptionKg"
                      id='id_f_SDocumenttemplate_descriptionKg'
                      label={translate('label:SDocumenttemplateAddEditView.descriptionKg')}
                      helperText={store.errors.descriptionKg}
                      error={!!store.errors.descriptionKg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.textColor}
                      onChange={(event) => store.handleChange(event)}
                      name="textColor"
                      data-testid="id_f_SDocumenttemplate_textColor"
                      id='id_f_SDocumenttemplate_textColor'
                      label={translate('label:SDocumenttemplateAddEditView.textColor')}
                      helperText={store.errors.textColor}
                      error={!!store.errors.textColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.backgroundColor}
                      onChange={(event) => store.handleChange(event)}
                      name="backgroundColor"
                      data-testid="id_f_SDocumenttemplate_backgroundColor"
                      id='id_f_SDocumenttemplate_backgroundColor'
                      label={translate('label:SDocumenttemplateAddEditView.backgroundColor')}
                      helperText={store.errors.backgroundColor}
                      error={!!store.errors.backgroundColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_SDocumenttemplate_name"
                      id='id_f_SDocumenttemplate_name'
                      label={translate('label:SDocumenttemplateAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_SDocumenttemplate_description"
                      id='id_f_SDocumenttemplate_description'
                      label={translate('label:SDocumenttemplateAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_SDocumenttemplate_code"
                      id='id_f_SDocumenttemplate_code'
                      label={translate('label:SDocumenttemplateAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.idcustomsvgicon}
                      onChange={(event) => store.handleChange(event)}
                      name="idcustomsvgicon"
                      data-testid="id_f_SDocumenttemplate_idcustomsvgicon"
                      id='id_f_SDocumenttemplate_idcustomsvgicon'
                      label={translate('label:SDocumenttemplateAddEditView.idcustomsvgicon')}
                      helperText={store.errors.idcustomsvgicon}
                      error={!!store.errors.idcustomsvgicon}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.iconcolor}
                      onChange={(event) => store.handleChange(event)}
                      name="iconcolor"
                      data-testid="id_f_SDocumenttemplate_iconcolor"
                      id='id_f_SDocumenttemplate_iconcolor'
                      label={translate('label:SDocumenttemplateAddEditView.iconcolor')}
                      helperText={store.errors.iconcolor}
                      error={!!store.errors.iconcolor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.iddocumenttype}
                      onChange={(event) => store.handleChange(event)}
                      name="iddocumenttype"
                      data-testid="id_f_SDocumenttemplate_iddocumenttype"
                      id='id_f_SDocumenttemplate_iddocumenttype'
                      label={translate('label:SDocumenttemplateAddEditView.iddocumenttype')}
                      helperText={store.errors.iddocumenttype}
                      error={!!store.errors.iddocumenttype}
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

export default BaseSDocumenttemplateView;
