import { FC, useEffect } from 'react';
import UploadedApplicationDocumentAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  applicationId: number;
  doc_id: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const UploadedApplicationDocumentPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
    store.applicationId = props.applicationId
    store.serviceDocumentId = props.doc_id

  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      {/* <DialogTitle>{translate('label:UploadedApplicationDocumentAddEditView.entityTitle')}</DialogTitle> */}
      <DialogContent>
        <UploadedApplicationDocumentAddEditBaseView
          isPopup={true}
        >
        </UploadedApplicationDocumentAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_UploadedApplicationDocumentSaveButton"
            name={'UploadedApplicationDocumentAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_UploadedApplicationDocumentCancelButton"
            name={'UploadedApplicationDocumentAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default UploadedApplicationDocumentPopupForm
