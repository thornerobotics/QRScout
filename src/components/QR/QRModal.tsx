import { useMemo } from 'preact/hooks';
import QRCode from 'qrcode.react';
import { getFieldValue, useQRScoutState } from '../../store/store';
import Button, { Variant } from '../core/Button';
import { Modal } from '../core/Modal';
import { Config } from '../inputs/BaseInputProps';
import { PreviewText } from './PreviewText';

export interface QRModalProps {
  show: boolean;
  onDismiss: () => void;
  qrDataString?: string;
  onMarkAsScanned?: () => void; // New optional prop for queue offloading
}

export function getQRCodeData(formData: Config): string {
  const data = formData.sections
    .map(s => s.fields)
    .flat()
    .map(v => `${v.value}`.replace(/\n/g, ' '))
    .join('\t');

  if (formData.title === 'Pit Scouting') {
    return `PIT:${data}`;
  }
  return data;
}

export function QRModal(props: QRModalProps) {
  const formData = useQRScoutState(state => state.formData);

  const qrCodeData = useMemo(() => {
    return props.qrDataString || getQRCodeData(formData);
  }, [formData, props.qrDataString]);

  const title = useMemo(() => {
    if (props.qrDataString) {
      // Logic for data coming from the queue
      const isPit = props.qrDataString.startsWith('PIT:');
      const rawData = isPit ? props.qrDataString.substring(4) : props.qrDataString;
      const parts = rawData.split('\t');

      if (isPit) {
        const teamNumber = parts[0] || 'Unknown';
        return `PIT - Team ${teamNumber}`;
      } else {
        const matchNumber = parts[1] || 'Unknown';
        const robot = parts[2] || 'Unknown';
        const teamNumber = parts[3] || 'Unknown';
        return `${robot} - Team ${teamNumber} - M${matchNumber}`;
      }
    } else {
      // Existing logic for live form data
      if (formData.title === 'Pit Scouting') {
        return `PIT - Team ${getFieldValue('teamNumber') || 'Unknown'}`.toUpperCase();
      } else {
        const robot = getFieldValue('robot') || 'Unknown';
        const team = getFieldValue('teamNumber') || 'Unknown';
        const match = getFieldValue('matchNumber') || 'Unknown';
        return `${robot} - Team ${team} - M${match}`.toUpperCase();
      }
    }
  }, [formData, props.qrDataString]);

  return (
    <Modal show={props.show} onDismiss={props.onDismiss}>
      <div className="flex flex-col items-center pt-8 px-4 pb-4 bg-white rounded-md">
        <QRCode className="m-2 mt-4" size={256} value={qrCodeData} />
        <h1 className="text-3xl text-gray-800 font-rhr-ns mb-4 text-center leading-tight">
          {title}
        </h1>
        <PreviewText data={qrCodeData} />
        {props.onMarkAsScanned && (
          <div className="mt-4 w-full px-2">
            <Button
              variant={Variant.Primary}
              onClick={props.onMarkAsScanned}
              className="w-full bg-aztechs-orange hover:bg-orange-700 text-white font-bold py-3 rounded shadow-lg transition-colors"
            >
              Mark as Scanned
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
