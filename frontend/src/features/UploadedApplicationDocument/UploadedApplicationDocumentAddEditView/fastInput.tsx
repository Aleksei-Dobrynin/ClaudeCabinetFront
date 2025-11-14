import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../UploadedApplicationDocumentListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type UploadedApplicationDocumentProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<UploadedApplicationDocumentProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadUploadedApplicationDocuments();
    }
  }, [props.mainId]);

  const columns = [
    {
                    field: 'hash_code',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.hash_code"),
                },
                {
                    field: 'hash_code_date',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.hash_code_date"),
                },
                {
                    field: 'service_document_id',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.service_document_id"),
                },
                {
                    field: 'file_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.file_id"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.updated_by"),
                },
                {
                    field: 'name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.name"),
                },
                {
                    field: 'application_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.application_id"),
                },
                {
                    field: 'status_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:uploaded_application_documentListView.status_id"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="UploadedApplicationDocument_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:UploadedApplicationDocumentAddEditView.entityTitle")}</h3>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_EmployeeContact_" + col.field;
              if (col.width == null) {
                return (
                  <Grid id={id} item xs sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
              } else
                return (
                  <Grid id={id} item xs={null} sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
            })}
            <Grid item xs={1}></Grid>
          </Grid>
          <Divider />

          {storeList.data.map((entity) => {
            const style = { backgroundColor: entity.id === store.id && "#F0F0F0" };
            return (
              <>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={style}
                  spacing={1}
                  id="id_EmployeeContact_row"
                >
                  {columns.map((col) => {
                    const id = "id_EmployeeContact_" + col.field + "_value";
                    if (col.width == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else
                      return (
                        <Grid item xs={col.width} id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                  })}
                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    {storeList.isEdit === false && (
                      <>
                        <IconButton
                          id="id_EmployeeContactEditButton"
                          name="edit_button"
                          style={{ margin: 0, marginRight: 5, padding: 0 }}
                          onClick={() => {
                            storeList.setFastInputIsEdit(true);
                            store.doLoad(entity.id);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          id="id_EmployeeContactDeleteButton"
                          name="delete_button"
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deleteUploadedApplicationDocument(entity.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Divider />
              </>
            );
          })}

          {storeList.isEdit ? (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              
                  <Grid item md={12} xs={12}>
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
                  </Grid>
                  <Grid item md={12} xs={12}>
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
                  </Grid>
                  <Grid item md={12} xs={12}>
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
                  </Grid>
                  <Grid item md={12} xs={12}>
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
                  </Grid>
                  <Grid item md={12} xs={12}>
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
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_UploadedApplicationDocumentSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadUploadedApplicationDocuments();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_UploadedApplicationDocumentCancelButton"
                  onClick={() => {
                    storeList.setFastInputIsEdit(false);
                    store.clearStore();
                  }}
                >
                  {translate("common:cancel")}
                </CustomButton>
              </Grid>
            </Grid>
          ) : (
            <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_UploadedApplicationDocumentAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                  // store.project_id = props.mainId;
                }}
              >
                {translate("common:add")}
              </CustomButton>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
});

export default FastInputView;
