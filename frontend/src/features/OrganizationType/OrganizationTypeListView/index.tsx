import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import OrganizationTypePopupForm from '../OrganizationTypeAddEditView/popupForm';
import store from "./store";


type OrganizationTypeListViewProps = {
  
};


const OrganizationTypeListView: FC<OrganizationTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'descriptionKg',
      headerName: translate("label:OrganizationTypeListView.descriptionKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_OrganizationType_column_descriptionKg"> {param.row.descriptionKg} </div>),
      renderHeader: (param) => (<div data-testid="table_OrganizationType_header_descriptionKg">{param.colDef.headerName}</div>)
    },
    {
      field: 'textColor',
      headerName: translate("label:OrganizationTypeListView.textColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_OrganizationType_column_textColor"> {param.row.textColor} </div>),
      renderHeader: (param) => (<div data-testid="table_OrganizationType_header_textColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'backgroundColor',
      headerName: translate("label:OrganizationTypeListView.backgroundColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_OrganizationType_column_backgroundColor"> {param.row.backgroundColor} </div>),
      renderHeader: (param) => (<div data-testid="table_OrganizationType_header_backgroundColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:OrganizationTypeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_OrganizationType_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_OrganizationType_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:OrganizationTypeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_OrganizationType_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_OrganizationType_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:OrganizationTypeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_OrganizationType_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_OrganizationType_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'nameKg',
      headerName: translate("label:OrganizationTypeListView.nameKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_OrganizationType_column_nameKg"> {param.row.nameKg} </div>),
      renderHeader: (param) => (<div data-testid="table_OrganizationType_header_nameKg">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:OrganizationTypeListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="OrganizationType"
      onDeleteClicked={(id) => store.deleteOrganizationType(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadOrganizationTypes,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <OrganizationTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadOrganizationTypes();
        }}
      />
    </BaseListView>
  );
})



export default OrganizationTypeListView
