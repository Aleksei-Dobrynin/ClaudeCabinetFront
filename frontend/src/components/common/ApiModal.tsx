import React, { FC, ReactNode, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { observer } from "mobx-react";
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

interface ApiModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSave: () => void;
  id?: number;
  loadData?: (id: number) => Promise<void>;
  clearData?: () => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
}

/**
 * A reusable modal component for API-related operations
 */
const ApiModal: FC<ApiModalProps> = observer(({
                                                open,
                                                title,
                                                children,
                                                onClose,
                                                onSave,
                                                id = 0,
                                                loadData,
                                                clearData,
                                                saveButtonText,
                                                cancelButtonText,
                                                maxWidth = 'sm',
                                                fullWidth = true
                                              }) => {
  const { t } = useTranslation();
  const translate = t;

  // Load data when modal opens if ID is provided
  useEffect(() => {
    if (open && id > 0 && loadData) {
      loadData(id);
    }

    // Clear data when modal closes
    return () => {
      if (clearData && !open) {
        clearData();
      }
    };
  }, [open, id, loadData, clearData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <CustomButton
          variant="contained"
          id="id_SaveButton"
          onClick={onSave}
        >
          {saveButtonText || translate("common:save")}
        </CustomButton>
        <CustomButton
          variant="contained"
          id="id_CancelButton"
          color="secondary"
          onClick={onClose}
        >
          {cancelButtonText || translate("common:cancel")}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
});

export default ApiModal;