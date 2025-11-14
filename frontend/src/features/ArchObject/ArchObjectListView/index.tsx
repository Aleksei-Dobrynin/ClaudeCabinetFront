import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ArchObjectPopupForm from '../ArchObjectAddEditView/popupForm';
import store from "./store";


type ArchObjectListViewProps = {
  
};


const ArchObjectListView: FC<ArchObjectListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'districtId',
      headerName: translate("label:ArchObjectListView.districtId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchObject_column_districtId"> {param.row.districtId} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchObject_header_districtId">{param.colDef.headerName}</div>)
    },
    {
      field: 'address',
      headerName: translate("label:ArchObjectListView.address"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchObject_column_address"> {param.row.address} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchObject_header_address">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:ArchObjectListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchObject_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchObject_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'identifier',
      headerName: translate("label:ArchObjectListView.identifier"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchObject_column_identifier"> {param.row.identifier} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchObject_header_identifier">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:ArchObjectListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchObject_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchObject_header_description">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ArchObjectListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="ArchObject"
      onDeleteClicked={(id) => store.deleteArchObject(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadArchObjects,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      {/* <ArchObjectPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadArchObjects();
        }}
      /> */}
    </BaseListView>
  );
})



export default ArchObjectListView
