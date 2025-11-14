import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import RepresentativeTypePopupForm from '../RepresentativeTypeAddEditView/popupForm';
import store from "./store";


type RepresentativeTypeListViewProps = {
  
};


const RepresentativeTypeListView: FC<RepresentativeTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'description',
      headerName: translate("label:RepresentativeTypeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_RepresentativeType_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_RepresentativeType_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:RepresentativeTypeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_RepresentativeType_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_RepresentativeType_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:RepresentativeTypeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_RepresentativeType_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_RepresentativeType_header_code">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:RepresentativeTypeListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="RepresentativeType"
      onDeleteClicked={(id) => store.deleteRepresentativeType(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadRepresentativeTypes,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <RepresentativeTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadRepresentativeTypes();
        }}
      />
    </BaseListView>
  );
})



export default RepresentativeTypeListView
