import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../ApplicationListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type ApplicationProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<ApplicationProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadApplications();
    }
  }, [props.mainId]);

  const columns = [
    {
                    field: 'work_description',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.work_description"),
                },
                {
                    field: 'arch_object_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.arch_object_id"),
                },
                {
                    field: 'status_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.status_id"),
                },
                {
                    field: 'company_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.company_id"),
                },
                {
                    field: 'r_service_id',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.r_service_id"),
                },
                {
                    field: 'r_service_name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.r_service_name"),
                },
                {
                    field: 'unique_code',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.unique_code"),
                },
                {
                    field: 'registration_date',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.registration_date"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.updated_by"),
                },
                {
                    field: 'deadline',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.deadline"),
                },
                {
                    field: 'number',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.number"),
                },
                {
                    field: 'comment',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:applicationListView.comment"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="Application_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:ApplicationAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteApplication(entity.id)}
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
                      value={store.workDescription}
                      onChange={(event) => store.handleChange(event)}
                      name="workDescription"
                      data-testid="id_f_Application_workDescription"
                      id='id_f_Application_workDescription'
                      label={translate('label:ApplicationAddEditView.workDescription')}
                      helperText={store.errors.workDescription}
                      error={!!store.errors.workDescription}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.archObjectId}
                      onChange={(event) => store.handleChange(event)}
                      name="archObjectId"
                      data={store.archObjects}
                      id='id_f_Application_archObjectId'
                      label={translate('label:ApplicationAddEditView.archObjectId')}
                      helperText={store.errors.archObjectId}
                      error={!!store.errors.archObjectId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.statusId}
                      onChange={(event) => store.handleChange(event)}
                      name="statusId"
                      data={store.applicationStatuses}
                      id='id_f_Application_statusId'
                      label={translate('label:ApplicationAddEditView.statusId')}
                      helperText={store.errors.statusId}
                      error={!!store.errors.statusId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.companyId}
                      onChange={(event) => store.handleChange(event)}
                      name="companyId"
                      data={store.customers}
                      id='id_f_Application_companyId'
                      label={translate('label:ApplicationAddEditView.companyId')}
                      helperText={store.errors.companyId}
                      error={!!store.errors.companyId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rServiceId}
                      onChange={(event) => store.handleChange(event)}
                      name="rServiceId"
                      data-testid="id_f_Application_rServiceId"
                      id='id_f_Application_rServiceId'
                      label={translate('label:ApplicationAddEditView.rServiceId')}
                      helperText={store.errors.rServiceId}
                      error={!!store.errors.rServiceId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rServiceName}
                      onChange={(event) => store.handleChange(event)}
                      name="rServiceName"
                      data-testid="id_f_Application_rServiceName"
                      id='id_f_Application_rServiceName'
                      label={translate('label:ApplicationAddEditView.rServiceName')}
                      helperText={store.errors.rServiceName}
                      error={!!store.errors.rServiceName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.uniqueCode}
                      onChange={(event) => store.handleChange(event)}
                      name="uniqueCode"
                      data-testid="id_f_Application_uniqueCode"
                      id='id_f_Application_uniqueCode'
                      label={translate('label:ApplicationAddEditView.uniqueCode')}
                      helperText={store.errors.uniqueCode}
                      error={!!store.errors.uniqueCode}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.registrationDate}
                      onChange={(event) => store.handleChange(event)}
                      name="registrationDate"
                      id='id_f_Application_registrationDate'
                      label={translate('label:ApplicationAddEditView.registrationDate')}
                      helperText={store.errors.registrationDate}
                      error={!!store.errors.registrationDate}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.deadline}
                      onChange={(event) => store.handleChange(event)}
                      name="deadline"
                      id='id_f_Application_deadline'
                      label={translate('label:ApplicationAddEditView.deadline')}
                      helperText={store.errors.deadline}
                      error={!!store.errors.deadline}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.number}
                      onChange={(event) => store.handleChange(event)}
                      name="number"
                      data-testid="id_f_Application_number"
                      id='id_f_Application_number'
                      label={translate('label:ApplicationAddEditView.number')}
                      helperText={store.errors.number}
                      error={!!store.errors.number}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.comment}
                      onChange={(event) => store.handleChange(event)}
                      name="comment"
                      data-testid="id_f_Application_comment"
                      id='id_f_Application_comment'
                      label={translate('label:ApplicationAddEditView.comment')}
                      helperText={store.errors.comment}
                      error={!!store.errors.comment}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_ApplicationSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadApplications();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_ApplicationCancelButton"
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
                id="id_ApplicationAddButton"
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
