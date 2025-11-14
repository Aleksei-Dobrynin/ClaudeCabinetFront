import React, { useState } from "react";
import { DataGrid, GridColDef, GridRowsProp, GridEventListener } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

export type TableColumn = {
  key: string; 
  label: string; 
  editable?: boolean; 
  type:  "string" | "number"; 
}



type TableProps = {
  columns: TableColumn[]; 
  initialData: Record<string, any>[]; 
  onSave: (data: Record<string, any>[]) => void; 
}

const DynamicTable: React.FC<TableProps> = ({ columns, initialData, onSave }) => {
  const { t } = useTranslation(['common']);
  const [rows, setRows] = useState<GridRowsProp>(
    initialData.map((row, index) => ({ id: index + 1, ...row }))
  );

  const gridColumns: GridColDef[] = columns.map((column) => ({
    field: column.key,
    headerName: column.label,
    editable: column.editable || false,
    type: column.type || "string",
    flex: 1,
  }));

  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const handleSave = () => {
    onSave(rows.map(({ id, ...row }) => row)); 
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={gridColumns}
        processRowUpdate={handleProcessRowUpdate}
        autoHeight
        // pageSize={5}
        // rowsPerPageOptions={[5, 10, 20]}
        // experimentalFeatures={{ newEditingApi: true }}
      />
      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        {t('saveData', { defaultValue: t('save') + ' ' + t('data', { defaultValue: 'data' }) })}
      </button>
    </div>
  );
};

export default DynamicTable;