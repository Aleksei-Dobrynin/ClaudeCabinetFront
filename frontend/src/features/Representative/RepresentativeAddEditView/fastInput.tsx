import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../RepresentativeListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type RepresentativeProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<RepresentativeProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadRepresentatives();
    }
  }, [props.mainId]);

  const columns = [
    {
      field: 'first_name',
      width: null,
      headerName: translate("label:RepresentativeListView.first_name"),
    },
    {
      field: 'second_name',
      width: null,
      headerName: translate("label:RepresentativeListView.second_name"),
    },
    {
      field: 'pin',
      width: null,
      headerName: translate("label:RepresentativeListView.pin"),
    },
    {
      field: 'created_at',
      width: null,
      headerName: translate("label:RepresentativeListView.created_at"),
    },
    {
      field: 'updated_at',
      width: null,
      headerName: translate("label:RepresentativeListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null,
      headerName: translate("label:RepresentativeListView.created_by"),
    },
    {
      field: 'updated_by',
      width: null,
      headerName: translate("label:RepresentativeListView.updated_by"),
    },
    {
      field: 'company_idNavName',
      width: null,
      headerName: translate("label:RepresentativeListView.company_id"),
    },
    {
      field: 'has_access',
      width: null,
      headerName: translate("label:RepresentativeListView.has_access"),
    },
    {
      field: 'type_idNavName',
      width: null,
      headerName: translate("label:RepresentativeListView.type_id"),
    },
    {
      field: 'last_name',
      width: null,
      headerName: translate("label:RepresentativeListView.last_name"),
    },
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="Representative_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:RepresentativeAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteRepresentative(entity.id)}
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
                      value={store.firstName}
                      onChange={(event) => store.handleChange(event)}
                      name="firstName"
                      data-testid="id_f_Representative_firstName"
                      id='id_f_Representative_firstName'
                      label={translate('label:RepresentativeAddEditView.firstName')}
                      helperText={store.errors.firstName}
                      error={!!store.errors.firstName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.secondName}
                      onChange={(event) => store.handleChange(event)}
                      name="secondName"
                      data-testid="id_f_Representative_secondName"
                      id='id_f_Representative_secondName'
                      label={translate('label:RepresentativeAddEditView.secondName')}
                      helperText={store.errors.secondName}
                      error={!!store.errors.secondName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                      data-testid="id_f_Representative_pin"
                      id='id_f_Representative_pin'
                      label={translate('label:RepresentativeAddEditView.pin')}
                      helperText={store.errors.pin}
                      error={!!store.errors.pin}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.hasAccess}
                      onChange={(event) => store.handleChange(event)}
                      name="hasAccess"
                      label={translate('label:RepresentativeAddEditView.hasAccess')}
                      id='id_f_Representative_hasAccess'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.typeId}
                      onChange={(event) => store.handleChange(event)}
                      name="typeId"
                      data={store.representativeTypes}
                      id='id_f_Representative_typeId'
                      label={translate('label:RepresentativeAddEditView.typeId')}
                      helperText={store.errors.typeId}
                      error={!!store.errors.typeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.lastName}
                      onChange={(event) => store.handleChange(event)}
                      name="lastName"
                      data-testid="id_f_Representative_lastName"
                      id='id_f_Representative_lastName'
                      label={translate('label:RepresentativeAddEditView.lastName')}
                      helperText={store.errors.lastName}
                      error={!!store.errors.lastName}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_RepresentativeSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadRepresentatives();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_RepresentativeCancelButton"
                  onClick={() => {
                    storeList.setFastInputIsEdit(false);
                    store.clearStore();
                  }}
                >
                  {translate("cancel")}
                </CustomButton>
              </Grid>
            </Grid>
          ) : (
            <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_RepresentativeAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                  // store.project_id = props.mainId;
                }}
              >
                {translate("add")}
              </CustomButton>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
});

export default FastInputView;