// src/components/Application/RejectPopup.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useApplicationStore, useUIStore } from '../stores/StoreContext';
import {
  Box,
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Chip,
  Badge,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Ckeditor from 'components/ckeditor/ckeditor';
import printJS from 'print-js';
import { useTranslation } from 'react-i18next';

export const RejectPopup: React.FC = observer(() => {
  const { application } = useApplicationStore();
  const applicationStore = useApplicationStore();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { t } = useTranslation();

  if (!application) return null;

  useEffect(() => {
    if (application.reject_html != null && application.reject_html !== "") {
      setConfirmDialogOpen(true)
    }
  }, [])

  if (application.reject_html === null || application.reject_html === "") return;

  return (
    <>
      <Tooltip title={t('label:rejectPopup.openRemarks')}>
        <IconButton onClick={() => setConfirmDialogOpen(true)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="sign-contract-dialog-title"
        maxWidth={"lg"}
        fullWidth
        aria-describedby="sign-contract-dialog-description"
      >
        <DialogTitle id="sign-contract-dialog-title">
          {t('label:rejectPopup.remarks')}
        </DialogTitle>
        <DialogContent>
          <Ckeditor
            value={application.reject_html ?? ""}
            disabled={true}
            withoutPlaceholder
            onChange={(event) => {
            }}
            name={`description_kg`}
            id={`id_f_release_description_kg`}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (application.reject_file_id) {
                applicationStore.openFileFromBga(application.reject_file_id, "Замечания.pdf")
              }
              return;
              printJS({
                printable: application.reject_html ?? "<h1></h1>",
                type: "raw-html",
                targetStyles: ["*"]
              });
            }}
            color="primary"
            variant='contained'
            size='small'
          >
            {t('common:print')}
          </Button>

          {/* {store.rejectFileId > 0 && <Box sx={{ mt: 2, ml: 2 }}>
            <CustomButton variant="contained" onClick={() => store.downloadFile(store.rejectFileId, "")}>
              Скачать
            </CustomButton>
          </Box>} */}
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            color="primary"
            variant='contained'
            size='small'
          >
            {t('common:close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default RejectPopup;