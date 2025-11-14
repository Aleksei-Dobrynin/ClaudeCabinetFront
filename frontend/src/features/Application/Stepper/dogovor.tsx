import React, { FC, useEffect } from "react";
import {
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import Ckeditor from "components/ckeditor/ckeditor";
import CustomButton from "components/Button";
import printJS from "print-js";

type TemplatePrintProps = {
  children?: React.ReactNode;
  disabled?: boolean;
};

const TemplatePrint: FC<TemplatePrintProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadTemplateDogovor()
  }, [store.id])

  return (
    <Box>
      <Ckeditor
        onChange={(e) => store.handleChange(e)}
        value={store.dogovorTemplate}
        withoutPlaceholder
        disabled={props.disabled}
        name="dogovorTemplate"
        id="dogovorTemplate"
      />
      <Box sx={{ mt: 2 }}>
        <CustomButton variant="contained" onClick={() => {
          printJS({
            printable: store.dogovorTemplate,
            type: "raw-html",
            targetStyles: ["*"],
          });
        }}>
          Печать
        </CustomButton>
      </Box>
    </Box>
  );
})

export default TemplatePrint;
