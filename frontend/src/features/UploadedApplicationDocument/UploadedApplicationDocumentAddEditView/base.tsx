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
import FileField from "components/FileField";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type UploadedApplicationDocumentTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseUploadedApplicationDocumentView: FC<UploadedApplicationDocumentTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="UploadedApplicationDocumentForm" id="UploadedApplicationDocumentForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="UploadedApplicationDocument_TitleName">
                  {translate('label:UploadedApplicationDocumentAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.hashCode}
                      onChange={(event) => store.handleChange(event)}
                      name="hashCode"
                      data-testid="id_f_UploadedApplicationDocument_hashCode"
                      id='id_f_UploadedApplicationDocument_hashCode'
                      label={translate('label:UploadedApplicationDocumentAddEditView.hashCode')}
                      helperText={store.errors.hashCode}
                      error={!!store.errors.hashCode}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.hashCodeDate}
                      onChange={(event) => store.handleChange(event)}
                      name="hashCodeDate"
                      id='id_f_UploadedApplicationDocument_hashCodeDate'
                      label={translate('label:UploadedApplicationDocumentAddEditView.hashCodeDate')}
                      helperText={store.errors.hashCodeDate}
                      error={!!store.errors.hashCodeDate}
                    />
                  </Grid> */}
                  {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.serviceDocumentId}
                      onChange={(event) => store.handleChange(event)}
                      name="serviceDocumentId"
                      data-testid="id_f_UploadedApplicationDocument_serviceDocumentId"
                      id='id_f_UploadedApplicationDocument_serviceDocumentId'
                      label={translate('label:UploadedApplicationDocumentAddEditView.serviceDocumentId')}
                      helperText={store.errors.serviceDocumentId}
                      error={!!store.errors.serviceDocumentId}
                    />
                  </Grid> */}
                  {/* <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.fileId}
                      onChange={(event) => store.handleChange(event)}
                      name="fileId"
                      data={store.appFiles}
                      id='id_f_UploadedApplicationDocument_fileId'
                      label={translate('label:UploadedApplicationDocumentAddEditView.fileId')}
                      helperText={store.errors.fileId}
                      error={!!store.errors.fileId}
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                  <FileField
                      value={store.fileName}
                      helperText={store.errors.fileName}
                      error={!!store.errors.fileName}
                      inputKey={store.idDocumentinputKey}
                      fieldName="fileName"
                      onChange={(event) => {
                        if (event.target.files.length == 0) return
                        store.handleChange({ target: { value: event.target.files[0], name: "file" } })
                        store.handleChange({ target: { value: event.target.files[0].name, name: "fileName" } })
                      }}
                      onClear={() => {
                        store.handleChange({ target: { value: null, name: "file" } })
                        store.handleChange({ target: { value: '', name: "fileName" } })
                        store.changeDocInputKey()
                      }}
                      allowedFileTypes={['.pdf', '.docx', '.txt','.xlsx', '.jpeg']}
                      maxFileSize={50 * 1024 * 1024}
                    />
                  </Grid>
                   {/* <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_UploadedApplicationDocument_name"
                      id='id_f_UploadedApplicationDocument_name'
                      label={translate('label:UploadedApplicationDocumentAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid> */}
                  {/* <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.statusId}
                      onChange={(event) => store.handleChange(event)}
                      name="statusId"
                      data={store.documentStatuses}
                      id='id_f_UploadedApplicationDocument_statusId'
                      label={translate('label:UploadedApplicationDocumentAddEditView.statusId')}
                      helperText={store.errors.statusId}
                      error={!!store.errors.statusId}
                    />
                  </Grid>  */}

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

export default BaseUploadedApplicationDocumentView;