import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { observer } from 'mobx-react';
import { Paper, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from './Button';
import { useTranslation } from 'react-i18next';


type GridProps = {
  columns: GridColDef[];
  data: any;
  onDeleteClicked?: (id) => void;
  addButtonClick?: () => void;
  onAddEditClick?: (id) => void;
  title?: string;
  tableName: string;
  hideAddButton?: boolean;
  customButton?: React.ReactNode;
  hideActions?: boolean;
  getRowHeight?: any;
  customBottom?: React.ReactNode;
  hustomHeader?: React.ReactNode;
  pageSize?: number
  hideDeleteButton?: boolean;
  hideEditButton?: boolean;
  editLabel?: string;
  editIcon?: React.ReactElement;
}

const PageGrid = observer((props: GridProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation();
  const translate = t;


  const actions: GridColDef[] = [{
    field: 'actions',
    type: 'actions',
    headerName: translate('actions'),
    width: 150,
    cellClassName: 'actions',
    getActions: ({ id }) => {

      var actions = [];

      if (!props.hideEditButton) {
        actions.push(
          <GridActionsCellItem
            icon={<Tooltip title={translate(props.editLabel ? props.editLabel : 'edit')}>{props.editIcon ? props.editIcon : <EditIcon />}</Tooltip>}
            label={translate('Actions')}
            className="textPrimary"
            data-testid={`${props.tableName}EditButton`}
            onClick={() => props.onAddEditClick ? props.onAddEditClick(id) : navigate(`/user/${props.tableName}/addedit?id=${id}`)}
            color="inherit"
          />)
      }
      if (!props.hideDeleteButton) {
        actions.push(
          <GridActionsCellItem
            icon={<Tooltip title={translate('delete')}><DeleteIcon /></Tooltip>}
            label={translate('Actions')}
            data-testid={`${props.tableName}DeleteButton`}
            onClick={() => props.onDeleteClicked(id)}
            color="inherit"
          />,
        )
      }
      return actions
    },
  }]

  let res = props.columns
  if (!props.hideActions) {
    res = actions.concat(props.columns)
  }

  return (
    <Paper elevation={5} style={{ width: '100%', padding: 20, marginBottom: 30 }}>
      <h1 data-testid={`${props.tableName}HeaderTitle`}>{props.title}</h1>
      {!props.hideAddButton && <CustomButton
        variant='contained'
        sx={{ m: 1 }}
        id={`${props.tableName}AddButton`}
        onClick={() => props.onAddEditClick ? props.onAddEditClick(0) : navigate(`/user/${props.tableName}/addedit?id=0`)}
        endIcon={<AddIcon />}
      >
        {translate('add')}
      </CustomButton>}
      {props.customButton}
      {props.hustomHeader}
      <DataGrid
        rows={props.data}
        columns={res}
        data-testid={`${props.tableName}Table`}
        initialState={{
          pagination: { paginationModel: { pageSize: props.pageSize ? props.pageSize : 25 } },
        }}
        slotProps={{
          pagination: {
            labelRowsPerPage: translate("rowsPerPage"),
          }
        }}
        pageSizeOptions={[25, 50, 100]}
        editMode="row"
        rowSelection={false}
        getRowHeight={props.getRowHeight}
      />
      {props.customBottom}
    </Paper>
  );
})



export default PageGrid