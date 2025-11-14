import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ApplicationPaidInvoicePopupForm from '../ApplicationPaidInvoiceAddEditView/popupForm';
import store from "./store";
import { Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainStore from "./../../../MainStore";

type ApplicationPaidInvoiceListViewProps = {
  customerId?: number;
  applicationId?: number;
};

const ApplicationPaidInvoiceListView: FC<ApplicationPaidInvoiceListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  // IMPORTANT: Set filters first before BaseListView attempts to load data
  // Synchronously set the filters immediately during component initialization
  // This executes before BaseListView's useEffect hooks
  React.useMemo(() => {
    // Set filters but don't load yet
    store.setFilters(props.customerId, props.applicationId);
  }, []);

  // Handle changes to props during component lifecycle
  useEffect(() => {
    // Update filters when props change
    store.setFilters(props.customerId, props.applicationId);
    // Then manually load data with correct filters
    store.loadApplicationPaidInvoices();
  }, [props.customerId, props.applicationId]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'applicationId',
      headerName: translate("label:ApplicationPaidInvoiceListView.applicationId"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_ApplicationPaidInvoice_column_applicationId">
          <Chip
            variant="outlined"
            label={translate("label:ApplicationPaidInvoiceListView.toApplicaition")+param.row.applicationId}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/Stepper?id=${param.row.applicationId}`);
            }}
            style={{ cursor: 'pointer', backgroundColor: MainStore.confirm.acceptBtn[0] }}
          />
        </div>
      ),
      renderHeader: (param) => (<div data-testid="table_ApplicationPaidInvoice_header_applicationId">{param.colDef.headerName}</div>)
    },
    {
      field: 'customerId',
      headerName: translate("label:ApplicationPaidInvoiceListView.customerName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPaidInvoice_column_customerId"> {param.row.customerName} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPaidInvoice_header_customerId">{param.colDef.headerName}</div>)
    },
    {
      field: 'date',
      headerName: translate("label:ApplicationPaidInvoiceListView.date"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPaidInvoice_column_date"> {param.row.date ? dayjs(param.row.date)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPaidInvoice_header_date">{param.colDef.headerName}</div>)
    },
    {
      field: 'paymentIdentifier',
      headerName: translate("label:ApplicationPaidInvoiceListView.paymentIdentifier"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPaidInvoice_column_paymentIdentifier"> {param.row.paymentIdentifier} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPaidInvoice_header_paymentIdentifier">{param.colDef.headerName}</div>)
    },
    {
      field: 'sum',
      headerName: translate("label:ApplicationPaidInvoiceListView.sum"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPaidInvoice_column_sum"> {param.row.sum} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPaidInvoice_header_sum">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:ApplicationPaidInvoiceListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPaidInvoice_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPaidInvoice_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'additional',
      headerName: translate("label:ApplicationPaidInvoiceListView.additional"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPaidInvoice_column_additional"> {param.row.additional} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPaidInvoice_header_additional">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ApplicationPaidInvoiceListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="ApplicationPaidInvoice"
      onDeleteClicked={(id) => store.deleteApplicationPaidInvoice(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        // This will only execute if we're ready to load with proper filters
        loadData: store.loadApplicationPaidInvoices,
        clearStore: store.clearStore
      }}
      hideActions={true}
      hideAddButton={true}
      viewMode="popup"
    >
      <ApplicationPaidInvoicePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadApplicationPaidInvoices();
        }}
      />
    </BaseListView>
  );
});

export default ApplicationPaidInvoiceListView;