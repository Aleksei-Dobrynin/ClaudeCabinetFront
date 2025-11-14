import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import DocumentStatusPopupForm from '../DocumentStatusAddEditView/popupForm';
import store from "./store";


type DocumentStatusListViewProps = {
  
};


const DocumentStatusListView: FC<DocumentStatusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'descriptionKg',
      headerName: translate("label:DocumentStatusListView.descriptionKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatus_column_descriptionKg"> {param.row.descriptionKg} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatus_header_descriptionKg">{param.colDef.headerName}</div>)
    },
    {
      field: 'textColor',
      headerName: translate("label:DocumentStatusListView.textColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatus_column_textColor"> {param.row.textColor} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatus_header_textColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'backgroundColor',
      headerName: translate("label:DocumentStatusListView.backgroundColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatus_column_backgroundColor"> {param.row.backgroundColor} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatus_header_backgroundColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:DocumentStatusListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatus_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatus_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:DocumentStatusListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatus_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatus_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:DocumentStatusListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatus_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatus_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'nameKg',
      headerName: translate("label:DocumentStatusListView.nameKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatus_column_nameKg"> {param.row.nameKg} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatus_header_nameKg">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:DocumentStatusListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="DocumentStatus"
      onDeleteClicked={(id) => store.deleteDocumentStatus(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadDocumentStatuss,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <DocumentStatusPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadDocumentStatuss();
        }}
      />
    </BaseListView>
  );
})



export default DocumentStatusListView
