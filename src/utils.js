import electron, { remote } from 'electron';
import fs from 'fs';
import path from 'path';

export const getPath = () => {
  const savePath = (remote || electron).app.getPath('userData');
  const extensionsStore = path.resolve(`${savePath}/extensions`);

  fs.mkdirSync(extensionsStore);
  return extensionsStore;
};