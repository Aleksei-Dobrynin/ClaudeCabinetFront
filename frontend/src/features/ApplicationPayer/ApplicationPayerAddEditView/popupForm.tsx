import { FC, useEffect } from 'react';
import ApplicationPayerAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  applicationId: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const ApplicationPayerPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
      store.handleChange({ target: { value: props.applicationId, name: "applicationId" } })
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:ApplicationPayerAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <ApplicationPayerAddEditBaseView
          isPopup={true}
        >
        </ApplicationPayerAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_ApplicationPayerSaveButton"
            name={'ApplicationPayerAddEditView.save'}
            onClick={() => {
              store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_ApplicationPayerCancelButton"
            name={'ApplicationPayerAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default ApplicationPayerPopupForm
