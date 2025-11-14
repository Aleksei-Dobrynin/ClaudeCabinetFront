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

type DocumentStatusHistoryTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseDocumentStatusHistoryView: FC<DocumentStatusHistoryTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="DocumentStatusHistoryForm" id="DocumentStatusHistoryForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="DocumentStatusHistory_TitleName">
                  {translate('label:DocumentStatusHistoryAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.documentId}
                      onChange={(event) => store.handleChange(event)}
                      name="documentId"
                      data={store.uploadedApplicationDocuments}
                      id='id_f_DocumentStatusHistory_documentId'
                      label={translate('label:DocumentStatusHistoryAddEditView.documentId')}
                      helperText={store.errors.documentId}
                      error={!!store.errors.documentId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.statusId}
                      onChange={(event) => store.handleChange(event)}
                      name="statusId"
                      data={store.documentStatuses}
                      id='id_f_DocumentStatusHistory_statusId'
                      label={translate('label:DocumentStatusHistoryAddEditView.statusId')}
                      helperText={store.errors.statusId}
                      error={!!store.errors.statusId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_DocumentStatusHistory_description"
                      id='id_f_DocumentStatusHistory_description'
                      label={translate('label:DocumentStatusHistoryAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.oldStatusId}
                      onChange={(event) => store.handleChange(event)}
                      name="oldStatusId"
                      data={store.documentStatuses}
                      id='id_f_DocumentStatusHistory_oldStatusId'
                      label={translate('label:DocumentStatusHistoryAddEditView.oldStatusId')}
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

export default BaseDocumentStatusHistoryView;
