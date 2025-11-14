import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ContactTypePopupForm from '../ContactTypeAddEditView/popupForm';
import store from "./store";

/**
 * ContactType list view component that displays all ContactTypes
 */
const ContactTypeListView: FC = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  // Define grid columns
  const columns: GridColDef[] = [
    { field: 'name', headerName: translate("label:ContactTypeListView.name"), flex: 1 },
    { field: 'code', headerName: translate("label:ContactTypeListView.code"), flex: 1 },
    { field: 'description', headerName: translate("label:ContactTypeListView.description"), flex: 1 },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ContactTypeListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="ContactType"
      onDeleteClicked={(id) => store.deleteContactType(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadContactTypes,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      {/* Popup form for editing/creating ContactTypes */}
      <ContactTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadContactTypes();
        }}
      />
    </BaseListView>
  );
});

export default ContactTypeListView;