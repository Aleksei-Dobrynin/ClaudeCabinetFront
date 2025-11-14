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
import Ckeditor from "components/ckeditor/ckeditor";

type SDocumenttemplatetranslationTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseSDocumenttemplatetranslationView: FC<SDocumenttemplatetranslationTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <form data-testid="SDocumenttemplatetranslationForm" id="SDocumenttemplatetranslationForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="SDocumenttemplatetranslation_TitleName">
                  {translate('label:SDocumenttemplatetranslationAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.idlanguage}
                      onChange={(event) => store.handleChange(event)}
                      name="idlanguage"
                      data={store.languages}
                      id='id_f_SDocumenttemplatetranslation_idlanguage'
                      label={translate('label:SDocumenttemplatetranslationAddEditView.idlanguage')}
                      helperText={store.errors.idlanguage}
                      error={!!store.errors.idlanguage}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Ckeditor
                      value={store.template}
                      onChange={(event) => store.handleChange(event)}
                      name="template"
                      data-testid="id_f_SDocumenttemplatetranslation_template"
                      id='id_f_SDocumenttemplatetranslation_template'
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

export default BaseSDocumenttemplatetranslationView;
