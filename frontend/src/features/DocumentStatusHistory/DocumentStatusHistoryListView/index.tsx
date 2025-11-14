import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import DocumentStatusHistoryPopupForm from '../DocumentStatusHistoryAddEditView/popupForm';
import store from "./store";


type DocumentStatusHistoryListViewProps = {
  
};


const DocumentStatusHistoryListView: FC<DocumentStatusHistoryListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'documentId',
      headerName: translate("label:DocumentStatusHistoryListView.documentId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatusHistory_column_documentId"> {param.row.documentId} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatusHistory_header_documentId">{param.colDef.headerName}</div>)
    },
    {
      field: 'statusId',
      headerName: translate("label:DocumentStatusHistoryListView.statusId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatusHistory_column_statusId"> {param.row.statusId} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatusHistory_header_statusId">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:DocumentStatusHistoryListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatusHistory_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatusHistory_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'oldStatusId',
      headerName: translate("label:DocumentStatusHistoryListView.oldStatusId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_DocumentStatusHistory_column_oldStatusId"> {param.row.oldStatusId} </div>),
      renderHeader: (param) => (<div data-testid="table_DocumentStatusHistory_header_oldStatusId">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:DocumentStatusHistoryListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="DocumentStatusHistory"
      onDeleteClicked={(id) => store.deleteDocumentStatusHistory(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadDocumentStatusHistorys,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <DocumentStatusHistoryPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadDocumentStatusHistorys();
        }}
      />
    </BaseListView>
  );
})



export default DocumentStatusHistoryListView
