import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../DocumentStatusHistoryListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type DocumentStatusHistoryProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<DocumentStatusHistoryProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadDocumentStatusHistorys();
    }
  }, [props.mainId]);

  const columns = [
    {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:document_status_historyListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:document_status_historyListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:document_status_historyListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:document_status_historyListView.updated_by"),
                },
                {
                    field: 'document_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:document_status_historyListView.document_id"),
                },
                {
                    field: 'status_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:document_status_historyListView.status_id"),
                },
                {
                    field: 'description',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:document_status_historyListView.description"),
                },
                {
                    field: 'old_status_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:document_status_historyListView.old_status_id"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="DocumentStatusHistory_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:DocumentStatusHistoryAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteDocumentStatusHistory(entity.id)}
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
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_DocumentStatusHistorySaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadDocumentStatusHistorys();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_DocumentStatusHistoryCancelButton"
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
                id="id_DocumentStatusHistoryAddButton"
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
