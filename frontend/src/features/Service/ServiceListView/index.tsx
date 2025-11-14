import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ServicePopupForm from '../ServiceAddEditView/popupForm';
import store from "./store";

/**
 * Service list view component that displays all services
 */
const ServiceListView: FC = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  // Define grid columns
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:ServiceListView.name"),
      flex: 1
    },
    {
      field: 'short_name',
      headerName: translate("label:ServiceListView.short_name"),
      flex: 1
    },
    {
      field: 'code',
      headerName: translate("label:ServiceListView.code"),
      flex: 1
    },
    {
      field: 'description',
      headerName: translate("label:ServiceListView.description"),
      flex: 1
    },
    {
      field: 'day_count',
      headerName: translate("label:ServiceListView.day_count"),
      flex: 1
    },
    {
      field: 'price',
      headerName: translate("label:ServiceListView.price"),
      flex: 1
    },
    {
      field: 'workflow_name',
      headerName: translate("label:ServiceListView.workflow_name"),
      flex: 1
    }
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ServiceListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="Service"
      onDeleteClicked={(id) => store.deleteService(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadServices,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      {/* Popup form for editing/creating services */}
      <ServicePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadServices();
        }}
      />
    </BaseListView>
  );
});

export default ServiceListView;