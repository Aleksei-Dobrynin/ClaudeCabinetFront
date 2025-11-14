import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ApplicationPayerPopupForm from '../ApplicationPayerAddEditView/popupForm';
import store from "./store";
import CustomButton from 'components/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import PayerListView from 'features/Payer/PayerListView';


type ApplicationPayerListViewProps = {
  applicationId: number;
  customerId: number;
  disabled?: boolean;
};


const ApplicationPayerListView: FC<ApplicationPayerListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.applicationId)
  }, [props.applicationId]);


  const columns: GridColDef[] = [
    // {
    //   field: 'lastName',
    //   headerName: translate("label:ApplicationPayerListView.last_name"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_lastName"> {param.row.lastName} {param.row.firstName} {param.row.secondName} </div>),
    //   renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_lastName">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'firstName',
    //   headerName: translate("label:ApplicationPayerListView.first_name"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_firstName"> {param.row.firstName} </div>),
    //   renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_firstName">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'secondName',
    //   headerName: translate("label:ApplicationPayerListView.second_name"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_secondName"> {param.row.secondName} </div>),
    //   renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_secondName">{param.colDef.headerName}</div>)
    // },
    {
      field: 'fullName',
      headerName: translate("label:ApplicationPayerListView.full_name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_fullName"> {param.row.fullName} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_fullName">{param.colDef.headerName}</div>)
    },
    {
      field: 'pin',
      headerName: translate("label:ApplicationPayerListView.pin"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_pin"> {param.row.pin} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_pin">{param.colDef.headerName}</div>)
    },
    {
      field: 'address',
      headerName: translate("label:ApplicationPayerListView.address"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_address"> {param.row.address} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_address">{param.colDef.headerName}</div>)
    },
    {
      field: 'director',
      headerName: translate("label:ApplicationPayerListView.director"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_director"> {param.row.director} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_director">{param.colDef.headerName}</div>)
    },

    // {
    //   field: 'okpo',
    //   headerName: translate("label:ApplicationPayerListView.okpo"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_okpo"> {param.row.okpo} </div>),
    //   renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_okpo">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'postalCode',
    //   headerName: translate("label:ApplicationPayerListView.postal_code"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_postalCode"> {param.row.postalCode} </div>),
    //   renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_postalCode">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'ugns',
    //   headerName: translate("label:ApplicationPayerListView.ugns"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_ugns"> {param.row.ugns} </div>),
    //   renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_ugns">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'regNumber',
    //   headerName: translate("label:ApplicationPayerListView.reg_number"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_regNumber"> {param.row.regNumber} </div>),
    //   renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_regNumber">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'typeOrganizationId',
    //   headerName: translate("label:ApplicationPayerListView.type_organization_id"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_ApplicationPayer_column_typeOrganizationId"> {param.row.typeOrganizationId} </div>),
    //   renderHeader: (param) => (<div data-testid="table_ApplicationPayer_header_typeOrganizationId">{param.colDef.headerName}</div>)
    // },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ApplicationPayerListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="ApplicationPayer"
      customButton={<><CustomButton onClick={() => store.changePanelChooseOldPayer(true)} variant='contained' sx={{ ml: 1, mb: 1 }}>
        {translate('label:ApplicationPayerListView.chooseFromPrevious')}
      </CustomButton></>}
      onDeleteClicked={(id) => store.deleteApplicationPayer(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadApplicationPayers,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <ApplicationPayerPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        applicationId={props.applicationId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadApplicationPayers();
        }}
      />

      <Dialog open={store.openPanelChooseOldPayer} onClose={() => store.changePanelChooseOldPayer(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{translate('label:ApplicationPayerAddEditView.entityTitle')}</DialogTitle>
        <DialogContent>
          <PayerListView
            disabled mainId={props.customerId}
            applicationId={props.applicationId}
            onPayerClicked={() => {
              store.changePanelChooseOldPayer(false)
              store.loadApplicationPayers()
            }}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_ApplicationPayerCancelButton"
            name={'ApplicationPayerAddEditView.cancel'}
            onClick={() => store.changePanelChooseOldPayer(false)}
          >
            {translate("common:close")}
          </CustomButton>
        </DialogActions>
      </Dialog >
    </BaseListView>
  );
})



export default ApplicationPayerListView