import React, { FC, useEffect, useMemo } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ApplicationPopupForm from './popupForm';
import store from "./store";
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Grid, IconButton, InputAdornment, Paper, Tooltip } from '@mui/material';
import LookUp from 'components/LookUp';
import CustomTextField from 'components/TextField';
import ClearIcon from "@mui/icons-material/Clear";
import CustomButton from 'components/Button';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

type ApplicationListViewProps = {
};

const MyArchiveApplications: FC<ApplicationListViewProps> = observer((props) => {
  const { t, i18n } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  // Получаем текущий язык
  const currentLanguage = i18n.language;

  useEffect(() => {
    store.doLoad()
  }, [])

  // Используем useMemo для оптимизации пересчета колонок
  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'id',
      headerName: translate("Подробнее"),
      flex: 0.2,
      renderCell: (param) => (<div data-testid="table_Application_column_number">
        <Box display={"flex"} sx={{ mt: 0.5}} justifyContent={"center"} alignItems={"center"}>
          <Tooltip title={"Просмотр"}>
            <IconButton onClick={() => {
              store.changeOpenPanelView(true, param.row.id)
            }}>
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_number">{param.colDef.headerName}</div>)
    },
    {
      field: 'number',
      headerName: translate("Номер заявки"),
      flex: 0.3,
      renderCell: (param) => (<div data-testid="table_Application_column_number"> {param.row.number} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_number">{param.colDef.headerName}</div>)
    },
    {
      field: 'registration_date',
      headerName: translate("Время регистрации"),
      flex: 0.4,
      renderCell: (param) => (<div data-testid="table_Application_column_registrationDate"> {param.row.registration_date ? dayjs(param.row.registration_date)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_registrationDate">{param.colDef.headerName}</div>)
    },
    // Колонка услуги в зависимости от языка
    {
      field: currentLanguage === 'ky-KG' ? 'service_name_kg' : 'service_name',
      headerName: translate("label:ApplicationListView.rServiceName"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_Application_column_rServiceName"> 
          {currentLanguage === 'ky-KG' ? param.row.service_name_kg : param.row.service_name} 
        </div>
      ),
      renderHeader: (param) => (<div data-testid="table_Application_header_rServiceName">{param.colDef.headerName}</div>)
    },
    {
      field: 'arch_object_address',
      headerName: translate("Адрес"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_workDescription"> {param.row.arch_object_address} {param.row.arch_object_district && `(${param.row.arch_object_district})`} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_workDescription">{param.colDef.headerName}</div>)
    },
    // Колонка статуса в зависимости от языка
    {
      field: currentLanguage === 'ky-KG' ? 'status_name_kg' : 'status_name',
      headerName: translate("label:ApplicationListView.statusId"),
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          variant="outlined"
          label={currentLanguage === 'ky-KG' ? params.row.status_name_kg : params.row.status_name}
          style={{ backgroundColor: params.row.status_color }}
        />
      ),
      renderHeader: (param) => (<div data-testid="table_Application_header_statusId">{param.colDef.headerName}</div>)
    },
  ], [currentLanguage, translate]);

  return (
    <Box>
      <BaseListView
        maxWidth={"xl"}
        marginTop={10}
        title={translate("Архив бумажных заявок")}
        columns={columns}
        data={store.data}
        tableName="Application"
        onAddEditClick={(id) => navigate(`/user/Stepper?id=${id}`)}
        onDeleteClicked={(id) => store.deleteApplication(id)}
        hideAddButton
        hideDeleteButton
        hideActions
        onEditClicked={(id) => store.onEditClicked(id)}
        store={{
          loadData: () => { },
          clearStore: store.clearStore
        }}
        viewMode="form"
      >
        <ApplicationPopupForm
          id={store.currentId}
          openPanel={store.openPanelView}
          onBtnCloseClick={() => {
            store.changeOpenPanelView(false, 0)
          }}
        />
      </BaseListView>
    </Box>
  );
})

export default MyArchiveApplications