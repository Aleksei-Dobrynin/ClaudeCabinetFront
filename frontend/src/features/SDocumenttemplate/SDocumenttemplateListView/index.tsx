import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import SDocumenttemplatePopupForm from '../SDocumenttemplateAddEditView/popupForm';
import store from "./store";


type SDocumenttemplateListViewProps = {
  
};


const SDocumenttemplateListView: FC<SDocumenttemplateListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'nameKg',
      headerName: translate("label:SDocumenttemplateListView.nameKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_nameKg"> {param.row.nameKg} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_nameKg">{param.colDef.headerName}</div>)
    },
    {
      field: 'descriptionKg',
      headerName: translate("label:SDocumenttemplateListView.descriptionKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_descriptionKg"> {param.row.descriptionKg} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_descriptionKg">{param.colDef.headerName}</div>)
    },
    {
      field: 'textColor',
      headerName: translate("label:SDocumenttemplateListView.textColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_textColor"> {param.row.textColor} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_textColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'backgroundColor',
      headerName: translate("label:SDocumenttemplateListView.backgroundColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_backgroundColor"> {param.row.backgroundColor} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_backgroundColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:SDocumenttemplateListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:SDocumenttemplateListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:SDocumenttemplateListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'idcustomsvgicon',
      headerName: translate("label:SDocumenttemplateListView.idcustomsvgicon"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_idcustomsvgicon"> {param.row.idcustomsvgicon} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_idcustomsvgicon">{param.colDef.headerName}</div>)
    },
    {
      field: 'iconcolor',
      headerName: translate("label:SDocumenttemplateListView.iconcolor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_iconcolor"> {param.row.iconcolor} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_iconcolor">{param.colDef.headerName}</div>)
    },
    {
      field: 'iddocumenttype',
      headerName: translate("label:SDocumenttemplateListView.iddocumenttype"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplate_column_iddocumenttype"> {param.row.iddocumenttype} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplate_header_iddocumenttype">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:SDocumenttemplateListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="SDocumenttemplate"
      onDeleteClicked={(id) => store.deleteSDocumenttemplate(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadSDocumenttemplates,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <SDocumenttemplatePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadSDocumenttemplates();
        }}
      />
    </BaseListView>
  );
})



export default SDocumenttemplateListView
