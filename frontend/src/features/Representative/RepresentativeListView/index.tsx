import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import RepresentativePopupForm from '../RepresentativeAddEditView/popupForm';
import store from "./store";
import { Checkbox } from '@mui/material';
import CustomButton from 'components/Button';
import MainStore from 'MainStore';


type RepresentativeListViewProps = {
  mainId: number;
  disabled?: boolean;

};


const RepresentativeListView: FC<RepresentativeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);


  const columns: GridColDef[] = [

    {
      field: 'lastName',
      headerName: translate("label:RepresentativeListView.lastName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Representative_column_lastName"> {`${param.row.lastName} ${param.row.firstName} ${param.row.secondName}`} </div>),
      renderHeader: (param) => (<div data-testid="table_Representative_header_lastName">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'firstName',
    //   headerName: translate("label:RepresentativeListView.firstName"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Representative_column_firstName"> {param.row.firstName} </div>),
    //   renderHeader: (param) => (<div data-testid="table_Representative_header_firstName">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'secondName',
    //   headerName: translate("label:RepresentativeListView.secondName"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Representative_column_secondName"> {param.row.secondName} </div>),
    //   renderHeader: (param) => (<div data-testid="table_Representative_header_secondName">{param.colDef.headerName}</div>)
    // },
    {
      field: 'pin',
      headerName: translate("label:RepresentativeListView.pin"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Representative_column_pin"> {param.row.pin} </div>),
      renderHeader: (param) => (<div data-testid="table_Representative_header_pin">{param.colDef.headerName}</div>)
    },
    {
      field: 'email',
      headerName: translate("label:RepresentativeListView.email"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Representative_column_email"> {param.row.email} </div>),
      renderHeader: (param) => (<div data-testid="table_Representative_header_email">{param.colDef.headerName}</div>)
    },
    {
      field: 'phone',
      headerName: translate("label:RepresentativeListView.phone"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Representative_column_phone"> {param.row.phone} </div>),
      renderHeader: (param) => (<div data-testid="table_Representative_header_phone">{param.colDef.headerName}</div>)
    },
    {
      field: 'hasAccess',
      headerName: translate("label:RepresentativeListView.hasAccess"),
      flex: 0.5,
      renderCell: (param) => (<div data-testid="table_Representative_column_hasAccess"><Checkbox disabled checked={param.row.hasAccess} /> </div>),
      renderHeader: (param) => (<div data-testid="table_Representative_header_hasAccess">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'hasAccount',
    //   headerName: translate("label:RepresentativeListView.hasAccount"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Representative_column_hasAccount"> <Checkbox disabled checked={param.row.hasAccount} /> </div>),
    //   renderHeader: (param) => (<div data-testid="table_Representative_header_hasAccount">{param.colDef.headerName}</div>)
    // },
    {
      field: 'register',
      headerName: translate("label:RepresentativeListView.hasAccount"),
      flex: 1.2,
      renderCell: (param) => (<div data-testid="table_Representative_column_hasAccount">
        <Checkbox disabled checked={param.row.hasAccount} />{(!param.row.hasAccount && param.row.email) &&
          <CustomButton variant='contained' onClick={() => store.sendInvite(param.row.id)}>{translate("label:RepresentativeListView.sendInvite")}</CustomButton>}
      </div>),
      renderHeader: (param) => (<div data-testid="table_Representative_header_hasAccount">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:RepresentativeListView.entityTitle")}
      columns={columns}
      hideActions={props.disabled || !MainStore.currentUser?.isDirector}
      hideAddButton={props.disabled || !MainStore.currentUser?.isDirector}
      data={store.data}
      tableName="Representative"
      onDeleteClicked={(id) => store.deleteRepresentative(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadRepresentatives,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <RepresentativePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        mainId={props.mainId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadRepresentatives();
        }}
      />
    </BaseListView>
  );
})



export default RepresentativeListView