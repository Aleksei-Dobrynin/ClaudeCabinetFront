import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ArchObjectTagPopupForm from '../ArchObjectTagAddEditView/popupForm';
import store from "./store";


type ArchObjectTagListViewProps = {
  mainId: number;

};


const ArchObjectTagListView: FC<ArchObjectTagListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'rTagId',
      headerName: translate("label:ArchObjectTagListView.rTagId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchObjectTag_column_rTagId"> {param.row.rTagId} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchObjectTag_header_rTagId">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ArchObjectTagListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="ArchObjectTag"
      onDeleteClicked={(id) => store.deleteArchObjectTag(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadArchObjectTags,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <ArchObjectTagPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadArchObjectTags();
        }}
      />
    </BaseListView>
  );
})



export default ArchObjectTagListView
