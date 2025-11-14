import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ApplicationStatusHistoryPopupForm from '../ApplicationStatusHistoryAddEditView/popupForm';
import store from "./store";


type ApplicationStatusHistoryListViewProps = {
  mainId: number;

};


const ApplicationStatusHistoryListView: FC<ApplicationStatusHistoryListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'statusId',
      headerName: translate("label:ApplicationStatusHistoryListView.statusId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationStatusHistory_column_statusId"> {param.row.statusId} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationStatusHistory_header_statusId">{param.colDef.headerName}</div>)
    },
    {
      field: 'oldStatusId',
      headerName: translate("label:ApplicationStatusHistoryListView.oldStatusId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationStatusHistory_column_oldStatusId"> {param.row.oldStatusId} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationStatusHistory_header_oldStatusId">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ApplicationStatusHistoryListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="ApplicationStatusHistory"
      onDeleteClicked={(id) => store.deleteApplicationStatusHistory(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadApplicationStatusHistories,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <ApplicationStatusHistoryPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadApplicationStatusHistories();
        }}
      />
    </BaseListView>
  );
})



export default ApplicationStatusHistoryListView
