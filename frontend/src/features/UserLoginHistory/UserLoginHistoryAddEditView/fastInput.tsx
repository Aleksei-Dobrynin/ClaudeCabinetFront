import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../UserLoginHistoryListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type UserLoginHistoryProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<UserLoginHistoryProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadUserLoginHistorys();
    }
  }, [props.mainId]);

  const columns = [
    {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.created_at"),
                },
                {
                    field: 'start_time',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.start_time"),
                },
                {
                    field: 'end_time',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.end_time"),
                },
                {
                    field: 'auth_type_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.auth_type_id"),
                },
                {
                    field: 'user_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.user_id"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.updated_by"),
                },
                {
                    field: 'ip_address',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.ip_address"),
                },
                {
                    field: 'device',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.device"),
                },
                {
                    field: 'browser',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.browser"),
                },
                {
                    field: 'os',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:user_login_historyListView.os"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="UserLoginHistory_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:UserLoginHistoryAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteUserLoginHistory(entity.id)}
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
                    <DateTimeField
                      value={store.startTime}
                      onChange={(event) => store.handleChange(event)}
                      name="startTime"
                      id='id_f_UserLoginHistory_startTime'
                      label={translate('label:UserLoginHistoryAddEditView.startTime')}
                      helperText={store.errors.startTime}
                      error={!!store.errors.startTime}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.endTime}
                      onChange={(event) => store.handleChange(event)}
                      name="endTime"
                      id='id_f_UserLoginHistory_endTime'
                      label={translate('label:UserLoginHistoryAddEditView.endTime')}
                      helperText={store.errors.endTime}
                      error={!!store.errors.endTime}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.authTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="authTypeId"
                      data={store.authTypes}
                      id='id_f_UserLoginHistory_authTypeId'
                      label={translate('label:UserLoginHistoryAddEditView.authTypeId')}
                      helperText={store.errors.authTypeId}
                      error={!!store.errors.authTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.ipAddress}
                      onChange={(event) => store.handleChange(event)}
                      name="ipAddress"
                      data-testid="id_f_UserLoginHistory_ipAddress"
                      id='id_f_UserLoginHistory_ipAddress'
                      label={translate('label:UserLoginHistoryAddEditView.ipAddress')}
                      helperText={store.errors.ipAddress}
                      error={!!store.errors.ipAddress}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.device}
                      onChange={(event) => store.handleChange(event)}
                      name="device"
                      data-testid="id_f_UserLoginHistory_device"
                      id='id_f_UserLoginHistory_device'
                      label={translate('label:UserLoginHistoryAddEditView.device')}
                      helperText={store.errors.device}
                      error={!!store.errors.device}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.browser}
                      onChange={(event) => store.handleChange(event)}
                      name="browser"
                      data-testid="id_f_UserLoginHistory_browser"
                      id='id_f_UserLoginHistory_browser'
                      label={translate('label:UserLoginHistoryAddEditView.browser')}
                      helperText={store.errors.browser}
                      error={!!store.errors.browser}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.os}
                      onChange={(event) => store.handleChange(event)}
                      name="os"
                      data-testid="id_f_UserLoginHistory_os"
                      id='id_f_UserLoginHistory_os'
                      label={translate('label:UserLoginHistoryAddEditView.os')}
                      helperText={store.errors.os}
                      error={!!store.errors.os}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_UserLoginHistorySaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadUserLoginHistorys();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_UserLoginHistoryCancelButton"
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
                id="id_UserLoginHistoryAddButton"
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
