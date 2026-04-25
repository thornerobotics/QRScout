import { produce } from 'immer';
import { cloneDeep } from 'lodash';
import { ChangeEvent } from 'react';
import configJson from '../../config/2025/config.json';
import pitConfigJson from '../pit_config.json';
import { Config } from '../components/inputs/BaseInputProps';
import { createStore } from './createStore';
import { getQRCodeData } from '../components/QR/QRModal';

function buildConfig(c: Config) {
  let config: Config = { ...c };
  config.sections
    .map(s => s.fields)
    .flat()
    .forEach(f => {
      if (f.defaultValue === undefined) {
        switch (f.type) {
          case 'text':
          case 'select':
          case 'image':
            f.defaultValue = '';
            break;
          case 'number':
          case 'range':
          case 'counter':
            f.defaultValue = 0;
            break;
          case 'boolean':
            f.defaultValue = false;
            break;
          default:
            f.defaultValue = undefined;
        }
      }
      f.value = f.defaultValue;
    });
  return config;
}

function getDefaultConfig(): Config {
  return buildConfig(configJson as Config);
}

function getPitConfig(): Config {
  return buildConfig(pitConfigJson as Config);
}

export function getConfig() {
  const configData = cloneDeep(useQRScoutState.getState().formData);

  configData.sections
    .map(s => s.fields)
    .flat()
    .forEach(f => delete f.value);

  return configData;
}

export interface QRScoutState {
  formData: Config;
}

export const useQRScoutState = createStore<QRScoutState>(
  {
    formData: getDefaultConfig(),
  },
  'qrScout',
  {
    version: 4,
  },
);

export function resetToDefaultConfig() {
  const currentConfig = useQRScoutState.getState().formData;
  if (currentConfig.title !== 'QRScout') {
    useQRScoutState.setState({ formData: getDefaultConfig() });
  }
}

export function resetToPitConfig() {
  const currentConfig = useQRScoutState.getState().formData;
  if (currentConfig.title !== 'Pit Scouting') {
    useQRScoutState.setState({ formData: getPitConfig() });
  }
}

export function updateValue(sectionName: string, code: string, data: any) {
  useQRScoutState.setState(
    produce((state: QRScoutState) => {
      let section = state.formData.sections.find(s => s.name === sectionName);
      if (section) {
        let field = section.fields.find(f => f.code === code);
        if (field) {
          field.value = data;
        }
      }
    }),
  );
}

export function resetSections() {
  useQRScoutState.setState(
    produce((state: QRScoutState) => {
      state.formData.sections.forEach(section => {
        section.fields.forEach(field => {
          if (!section.preserveDataOnReset && !field.preserveDataOnReset) {
            field.value = field.defaultValue;
          }
          if (field.autoIncrementOnReset && typeof field.value === 'number') {
            field.value = (field.value as number) + 1;
          }
        });
      });
    }),
  );
}

export function saveToQueue() {
  const state = useQRScoutState.getState();
  const qrData = getQRCodeData(state.formData);
  
  // Create a structured data object of all fields
  const payload = state.formData.sections
    .flatMap(s => s.fields)
    .reduce((acc, f) => ({ ...acc, [f.code]: f.value }), {});

  const queue = JSON.parse(localStorage.getItem('aztech_queue') || '[]');

  queue.push({
    data: qrData,
    payload: payload, // Structured data object included
    type: state.formData.title === 'Pit Scouting' ? 'PIT' : 'MATCH',
    timestamp: new Date().toISOString(),
    scanned: false,
  });

  localStorage.setItem('aztech_queue', JSON.stringify(queue));
  resetSections();
}

export function setFormData(config: Config) {
  useQRScoutState.setState({ formData: buildConfig(config) });
}

export function setConfig(configText: string) {
  const jsonData = JSON.parse(configText);
  setFormData(jsonData as Config);
}

export function uploadConfig(evt: ChangeEvent<HTMLInputElement>) {
  var reader = new FileReader();
  reader.onload = function (e) {
    const configText = e.target?.result as string;
    setConfig(configText);
  };
  if (evt.currentTarget.files && evt.currentTarget.files.length > 0) {
    reader.readAsText(evt.currentTarget.files[0]);
  }
}

export const inputSelector =
  (section: string, code: string) => (state: QRScoutState) => {
    const formData = state.formData;
    return formData.sections
      .find(s => s.name === section)
      ?.fields.find(f => f.code === code);
  };

export function getFieldValue(code: string) {
  return useQRScoutState
    .getState()
    .formData.sections.map(s => s.fields)
    .flat()
    .find(f => f.code === code)?.value;
}
