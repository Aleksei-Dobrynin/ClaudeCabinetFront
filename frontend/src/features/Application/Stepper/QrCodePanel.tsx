import { FC, useEffect, useRef, useState } from 'react';
import ApplicationAddEditBaseView from './base';
import store from "./store"
import { observer } from "mobx-react"
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import QRCode from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';

type PopupFormProps = {
  openPanel: boolean;
  onBtnCancelClick: () => void;
  guid: string;
}

const QrCodePanel: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const qrRef = useRef<HTMLDivElement>(null);

  const url = `http://145.223.98.93:7011/application?guid=${props.guid}` //TODO

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="sm" fullWidth>
      <DialogTitle>QR-код</DialogTitle>
      <DialogContent>

        <div className="flex flex-col items-center p-4">
          <div ref={qrRef} className="mb-4">
            <QRCodeCanvas
              value={url}
              size={256}
              level="M"
            />
          </div>

          <button
            onClick={downloadQRCode}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Скачать QR-код
          </button>
        </div>
      </DialogContent>
      <DialogActions>
        <DialogActions>

          <CustomButton
            variant="contained"
            id="id_ApplicationCancelButton"
            name={'ApplicationAddEditView.cancel'}
            onClick={() => props.onBtnCancelClick()}
          >
            {translate("common:close")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
})

export default QrCodePanel
