import { FC, useEffect } from 'react';
import CustomerRequisiteAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  mainId: number;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
}

const CustomerRequisitePopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      // store.handleChange({ target: { value: props.mainId, name: "organizationId" } })
      // store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>{translate('label:CustomerRequisiteAddEditView.entityTitle')}</DialogTitle>
      <DialogContent>
        <CustomerRequisiteAddEditBaseView
          isPopup={true}
        >
        </CustomerRequisiteAddEditBaseView>
      </DialogContent>
      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_CustomerRequisiteSaveButton"
            name={'CustomerRequisiteAddEditView.save'}
            onClick={() => {
              // store.onSaveClick((id: number) => props.onSaveClick(id))
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_CustomerRequisiteCancelButton"
            name={'CustomerRequisiteAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default CustomerRequisitePopupForm
