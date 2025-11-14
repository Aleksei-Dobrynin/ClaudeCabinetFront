import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import PayerPopupForm from '../PayerAddEditView/popupForm';
import store from "./store";
import CustomButton from 'components/Button';


type PayerListViewProps = {
  disabled: boolean;
  mainId: number;
  applicationId: number;
  onPayerClicked: () => void;
};


const PayerListView: FC<PayerListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  
  useEffect(() => {
    store.clearStore()
  }, []);


  const columns: GridColDef[] = [

    {
      field: 'id',
      headerName: translate("Выбрать"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Payer_column_id"> 
      <CustomButton variant='contained' onClick={() => {
        store.choosePayerClicked(param.row.id, props.applicationId, props.onPayerClicked)
      }}>Выбрать</CustomButton> 
      </div>),
      renderHeader: (param) => (<div data-testid="table_Payer_header_id">{param.colDef.headerName}</div>)
    },
    {
      field: 'lastName',
      headerName: translate("ФИО"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Payer_column_lastName"> {param.row.lastName} {param.row.firstName} {param.row.secondName} </div>),
      renderHeader: (param) => (<div data-testid="table_Payer_header_lastName">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'firstName',
    //   headerName: translate("label:PayerListView.firstName"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Payer_column_firstName"> {param.row.firstName} </div>),
    //   renderHeader: (param) => (<div data-testid="table_Payer_header_firstName">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'secondName',
    //   headerName: translate("label:PayerListView.secondName"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Payer_column_secondName"> {param.row.secondName} </div>),
    //   renderHeader: (param) => (<div data-testid="table_Payer_header_secondName">{param.colDef.headerName}</div>)
    // },
    {
      field: 'fullName',
      headerName: translate("label:PayerListView.fullName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Payer_column_fullName"> {param.row.fullName} </div>),
      renderHeader: (param) => (<div data-testid="table_Payer_header_fullName">{param.colDef.headerName}</div>)
    },
    {
      field: 'pin',
      headerName: translate("label:PayerListView.pin"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Payer_column_pin"> {param.row.pin} </div>),
      renderHeader: (param) => (<div data-testid="table_Payer_header_pin">{param.colDef.headerName}</div>)
    },
    {
      field: 'address',
      headerName: translate("label:PayerListView.address"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Payer_column_address"> {param.row.address} </div>),
      renderHeader: (param) => (<div data-testid="table_Payer_header_address">{param.colDef.headerName}</div>)
    },
    {
      field: 'director',
      headerName: translate("label:PayerListView.director"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Payer_column_director"> {param.row.director} </div>),
      renderHeader: (param) => (<div data-testid="table_Payer_header_director">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:PayerListView.entityTitle")}
      columns={columns}
      data={store.data}
      hideAddButton={props.disabled}
      tableName="Payer"
      onDeleteClicked={(id) => store.deletePayer(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadPayers,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <PayerPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        mainId={props.mainId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadPayers();
        }}
      />
    </BaseListView>
  );
})



export default PayerListView
