import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../SDocumenttemplateListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type SDocumenttemplateProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<SDocumenttemplateProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadSDocumenttemplates();
    }
  }, [props.mainId]);

  const columns = [
    {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.updated_at"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.updated_by"),
                },
                {
                    field: 'name_kg',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.name_kg"),
                },
                {
                    field: 'description_kg',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.description_kg"),
                },
                {
                    field: 'text_color',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.text_color"),
                },
                {
                    field: 'background_color',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.background_color"),
                },
                {
                    field: 'name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.name"),
                },
                {
                    field: 'description',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.description"),
                },
                {
                    field: 'code',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.code"),
                },
                {
                    field: 'idCustomSvgIcon',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.idCustomSvgIcon"),
                },
                {
                    field: 'iconColor',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.iconColor"),
                },
                {
                    field: 'idDocumentType',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.idDocumentType"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.created_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:S_DocumentTemplateListView.created_by"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="SDocumenttemplate_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:SDocumenttemplateAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteSDocumenttemplate(entity.id)}
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
                      value={store.nameKg}
                      onChange={(event) => store.handleChange(event)}
                      name="nameKg"
                      data-testid="id_f_SDocumenttemplate_nameKg"
                      id='id_f_SDocumenttemplate_nameKg'
                      label={translate('label:SDocumenttemplateAddEditView.nameKg')}
                      helperText={store.errors.nameKg}
                      error={!!store.errors.nameKg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.descriptionKg}
                      onChange={(event) => store.handleChange(event)}
                      name="descriptionKg"
                      data-testid="id_f_SDocumenttemplate_descriptionKg"
                      id='id_f_SDocumenttemplate_descriptionKg'
                      label={translate('label:SDocumenttemplateAddEditView.descriptionKg')}
                      helperText={store.errors.descriptionKg}
                      error={!!store.errors.descriptionKg}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.textColor}
                      onChange={(event) => store.handleChange(event)}
                      name="textColor"
                      data-testid="id_f_SDocumenttemplate_textColor"
                      id='id_f_SDocumenttemplate_textColor'
                      label={translate('label:SDocumenttemplateAddEditView.textColor')}
                      helperText={store.errors.textColor}
                      error={!!store.errors.textColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.backgroundColor}
                      onChange={(event) => store.handleChange(event)}
                      name="backgroundColor"
                      data-testid="id_f_SDocumenttemplate_backgroundColor"
                      id='id_f_SDocumenttemplate_backgroundColor'
                      label={translate('label:SDocumenttemplateAddEditView.backgroundColor')}
                      helperText={store.errors.backgroundColor}
                      error={!!store.errors.backgroundColor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_SDocumenttemplate_name"
                      id='id_f_SDocumenttemplate_name'
                      label={translate('label:SDocumenttemplateAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_SDocumenttemplate_description"
                      id='id_f_SDocumenttemplate_description'
                      label={translate('label:SDocumenttemplateAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.code}
                      onChange={(event) => store.handleChange(event)}
                      name="code"
                      data-testid="id_f_SDocumenttemplate_code"
                      id='id_f_SDocumenttemplate_code'
                      label={translate('label:SDocumenttemplateAddEditView.code')}
                      helperText={store.errors.code}
                      error={!!store.errors.code}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.idcustomsvgicon}
                      onChange={(event) => store.handleChange(event)}
                      name="idcustomsvgicon"
                      data-testid="id_f_SDocumenttemplate_idcustomsvgicon"
                      id='id_f_SDocumenttemplate_idcustomsvgicon'
                      label={translate('label:SDocumenttemplateAddEditView.idcustomsvgicon')}
                      helperText={store.errors.idcustomsvgicon}
                      error={!!store.errors.idcustomsvgicon}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.iconcolor}
                      onChange={(event) => store.handleChange(event)}
                      name="iconcolor"
                      data-testid="id_f_SDocumenttemplate_iconcolor"
                      id='id_f_SDocumenttemplate_iconcolor'
                      label={translate('label:SDocumenttemplateAddEditView.iconcolor')}
                      helperText={store.errors.iconcolor}
                      error={!!store.errors.iconcolor}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.iddocumenttype}
                      onChange={(event) => store.handleChange(event)}
                      name="iddocumenttype"
                      data-testid="id_f_SDocumenttemplate_iddocumenttype"
                      id='id_f_SDocumenttemplate_iddocumenttype'
                      label={translate('label:SDocumenttemplateAddEditView.iddocumenttype')}
                      helperText={store.errors.iddocumenttype}
                      error={!!store.errors.iddocumenttype}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_SDocumenttemplateSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadSDocumenttemplates();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_SDocumenttemplateCancelButton"
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
                id="id_SDocumenttemplateAddButton"
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
