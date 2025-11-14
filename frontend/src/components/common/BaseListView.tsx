import React, { FC, ReactNode, useEffect } from 'react';
import { Container } from '@mui/material';
import { observer } from "mobx-react";
import { GridColDef } from '@mui/x-data-grid';
import PageGrid from 'components/PageGrid';
import PopupGrid from 'components/PopupGrid';

interface BaseListViewProps {
  title: string;
  columns: GridColDef[];
  data: any[];
  tableName: string;
  onDeleteClicked?: (id: number) => void;
  onEditClicked?: (id: number) => void;
  onAddEditClick?: (id: number) => void;
  store: {
    loadData: () => void;
    clearStore: () => void;
  };
  viewMode?: 'form' | 'popup';
  hideAddButton?: boolean;
  hideDeleteButton?: boolean;
  hideActions?: boolean;
  topComponent?: ReactNode;
  customButton?: ReactNode;
  children?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  marginTop?: number;
  checkboxSelection?: boolean;
  onRowSelectionModelChange?: (rowSelectionModel, details) => void;
  isRowSelectable?: (params) => boolean;
  editLabel?: string;
  editIcon?: React.ReactElement;
}

/**
 * A base list view component for displaying data grids with common functionality
 */
const BaseListView: FC<BaseListViewProps> = observer((props: BaseListViewProps) => {
  // Load data on component mount
  useEffect(() => {
    props.store.loadData();
    return () => {
      props.store.clearStore();
    };
  }, []);

  // Debug data changes
  useEffect(() => {
  }, [props.data]);

  let gridComponent = null;

  switch (props.viewMode) {
    case 'form':
      gridComponent = (
        <PageGrid
          key={JSON.stringify(props.data)}
          title={props.title}
          onDeleteClicked={props.onDeleteClicked}
          columns={props.columns}
          onAddEditClick={props.onAddEditClick}
          hideDeleteButton
          customButton={props.customButton}
          data={props.data}
          tableName={props.tableName}
          hideAddButton={props.hideAddButton}
          hideActions={props.hideActions}
          editIcon={props.editIcon}
          editLabel={props.editLabel}
        />
      );
      break;
    case 'popup':
      gridComponent = (
        <PopupGrid
          key={JSON.stringify(props.data)}
          title={props.title}
          onDeleteClicked={props.onDeleteClicked}
          onEditClicked={props.onEditClicked}
          columns={props.columns}
          data={props.data}
          customButton={props.customButton}
          tableName={props.tableName}
          hideAddButton={props.hideAddButton}
          hideActions={props.hideActions}
          checkboxSelection={props.checkboxSelection}
          onRowSelectionModelChange={props.onRowSelectionModelChange}
          isRowSelectable={props.isRowSelectable}
        />
      );
      break;
  }

  return (
    <Container maxWidth={props.maxWidth} style={{ marginTop: props.marginTop }}>
      {props.topComponent}
      {gridComponent}
      {props.children}
    </Container>
  );
});

export default BaseListView;