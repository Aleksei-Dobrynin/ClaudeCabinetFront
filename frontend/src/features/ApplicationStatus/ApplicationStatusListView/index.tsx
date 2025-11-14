import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ApplicationStatusPopupForm from '../ApplicationStatusAddEditView/popupForm';
import store from "./store";


type ApplicationStatusListViewProps = {
  
};


const ApplicationStatusListView: FC<ApplicationStatusListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'descriptionKg',
      headerName: translate("label:ApplicationStatusListView.descriptionKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationStatus_column_descriptionKg"> {param.row.descriptionKg} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationStatus_header_descriptionKg">{param.colDef.headerName}</div>)
    },
    {
      field: 'textColor',
      headerName: translate("label:ApplicationStatusListView.textColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationStatus_column_textColor"> {param.row.textColor} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationStatus_header_textColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'backgroundColor',
      headerName: translate("label:ApplicationStatusListView.backgroundColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationStatus_column_backgroundColor"> {param.row.backgroundColor} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationStatus_header_backgroundColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:ApplicationStatusListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationStatus_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationStatus_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:ApplicationStatusListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationStatus_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationStatus_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:ApplicationStatusListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationStatus_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationStatus_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'nameKg',
      headerName: translate("label:ApplicationStatusListView.nameKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationStatus_column_nameKg"> {param.row.nameKg} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationStatus_header_nameKg">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ApplicationStatusListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="ApplicationStatus"
      onDeleteClicked={(id) => store.deleteApplicationStatus(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadApplicationStatuss,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <ApplicationStatusPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadApplicationStatuss();
        }}
      />
    </BaseListView>
  );
})



export default ApplicationStatusListView
