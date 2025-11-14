import { FC, useEffect } from "react";
import ArchObjectAddEditBaseView from "./base";
import store from "./store";
import { observer } from "mobx-react";
import { DialogActions, DialogContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import { ArchObject } from "constants/ArchObject";

type PopupFormProps = {
  openPanel: boolean;
  onBtnCancelClick: () => void;
  onSaveClick: (data: ArchObject) => void;
  data: ArchObject;
}

const ArchObjectPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.setData(props.data);
      store.doLoad();
    } else {
      store.clearStore();
    }
  }, [props.openPanel]);

  return (
    <>
      {props.openPanel && <div>
        <DialogContent>
          <ArchObjectAddEditBaseView
            isPopup={true}
          >
          </ArchObjectAddEditBaseView>
        </DialogContent>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_ArchObjectSaveButton"
            name={"ArchObjectAddEditView.save"}
            onClick={() => {
              store.onSaveClick((data: ArchObject) => props.onSaveClick(data));
            }}
          >
            {translate("common:save")}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="id_ArchObjectCancelButton"
            name={"ArchObjectAddEditView.cancel"}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </div>}
    </>
  );
});

export default ArchObjectPopupForm;