import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../OrganizationTypeListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type OrganizationTypeProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<OrganizationTypeProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadOrganizationTypes();
    }
  }, [props.mainId]);

  const columns = [
    {
                    field: 'description_kg',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.description_kg"),
                },
                {
                    field: 'text_color',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.text_color"),
                },
                {
                    field: 'background_color',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.background_color"),
                },
                {
                    field: 'name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.name"),
                },
                {
                    field: 'description',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.description"),
                },
                {
                    field: 'code',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.code"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.updated_by"),
                },
                {
                    field: 'name_kg',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:organization_typeListView.name_kg"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="OrganizationType_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:OrganizationTypeAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteOrganizationType(entity.id)}
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
                      value={store.descriptionKg}
                      onChange={(event) => store.handleChange(event)}
                      name="descriptionKg"
                      data-testid="id_f_OrganizationType_descriptionKg"
                      id='id_f_OrganizationType_descriptionKg'
                      label={translate('label:OrganizationTypeAddEditView.descriptionKg')}
                      helperText={store.errors.descriptionKg}
                      error={!!store.errors.descriptionKg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.textColor}
                      onChange={(event) => store.handleChange(event)}
                      name="textColor"
                      data-testid="id_f_OrganizationType_textColor"
                      id='id_f_OrganizationType_textColor'
                      label={translate('label:OrganizationTypeAddEditView.textColor')}
                      helperText={store.errors.textColor}
                      error={!!store.errors.textColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.backgroundColor}
                      onChange={(event) => store.handleChange(event)}
                      name="backgroundColor"
                      data-testid="id_f_OrganizationType_backgroundColor"
                      id='id_f_OrganizationType_backgroundColor'
                      label={translate('label:OrganizationTypeAddEditView.backgroundColor')}
                      helperText={store.errors.backgroundColor}
                      error={!!store.errors.backgroundColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_OrganizationType_name"
                      id='id_f_OrganizationType_name'
                      label={translate('label:OrganizationTypeAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_OrganizationType_description"
                      id='id_f_OrganizationType_description'
                      label={translate('label:OrganizationTypeAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_OrganizationType_code"
                      id='id_f_OrganizationType_code'
                      label={translate('label:OrganizationTypeAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.nameKg}
                      onChange={(event) => store.handleChange(event)}
                      name="nameKg"
                      data-testid="id_f_OrganizationType_nameKg"
                      id='id_f_OrganizationType_nameKg'
                      label={translate('label:OrganizationTypeAddEditView.nameKg')}
                      helperText={store.errors.nameKg}
                      error={!!store.errors.nameKg}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_OrganizationTypeSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadOrganizationTypes();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_OrganizationTypeCancelButton"
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
                id="id_OrganizationTypeAddButton"
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
