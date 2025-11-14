import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../NotificationLogListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type NotificationLogProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<NotificationLogProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadNotificationLogs();
    }
  }, [props.mainId]);

  const columns = [
    {
                    field: 'text',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.text"),
                },
                {
                    field: 'title',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.title"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.updated_by"),
                },
                {
                    field: 'application_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.application_id"),
                },
                {
                    field: 'contact',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.contact"),
                },
                {
                    field: 'date_send',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.date_send"),
                },
                {
                    field: 'r_contact_type_id',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:notification_logListView.r_contact_type_id"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="NotificationLog_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:NotificationLogAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteNotificationLog(entity.id)}
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
                      value={store.text}
                      onChange={(event) => store.handleChange(event)}
                      name="text"
                      data-testid="id_f_NotificationLog_text"
                      id='id_f_NotificationLog_text'
                      label={translate('label:NotificationLogAddEditView.text')}
                      helperText={store.errors.text}
                      error={!!store.errors.text}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.title}
                      onChange={(event) => store.handleChange(event)}
                      name="title"
                      data-testid="id_f_NotificationLog_title"
                      id='id_f_NotificationLog_title'
                      label={translate('label:NotificationLogAddEditView.title')}
                      helperText={store.errors.title}
                      error={!!store.errors.title}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.applicationId}
                      onChange={(event) => store.handleChange(event)}
                      name="applicationId"
                      data={store.applications}
                      id='id_f_NotificationLog_applicationId'
                      label={translate('label:NotificationLogAddEditView.applicationId')}
                      helperText={store.errors.applicationId}
                      error={!!store.errors.applicationId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.contact}
                      onChange={(event) => store.handleChange(event)}
                      name="contact"
                      data-testid="id_f_NotificationLog_contact"
                      id='id_f_NotificationLog_contact'
                      label={translate('label:NotificationLogAddEditView.contact')}
                      helperText={store.errors.contact}
                      error={!!store.errors.contact}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.dateSend}
                      onChange={(event) => store.handleChange(event)}
                      name="dateSend"
                      data-testid="id_f_NotificationLog_dateSend"
                      id='id_f_NotificationLog_dateSend'
                      label={translate('label:NotificationLogAddEditView.dateSend')}
                      helperText={store.errors.dateSend}
                      error={!!store.errors.dateSend}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rContactTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="rContactTypeId"
                      data-testid="id_f_NotificationLog_rContactTypeId"
                      id='id_f_NotificationLog_rContactTypeId'
                      label={translate('label:NotificationLogAddEditView.rContactTypeId')}
                      helperText={store.errors.rContactTypeId}
                      error={!!store.errors.rContactTypeId}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_NotificationLogSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadNotificationLogs();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_NotificationLogCancelButton"
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
                id="id_NotificationLogAddButton"
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
