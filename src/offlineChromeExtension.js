import fs from 'fs';
import path from 'path';
import zip from 'cross-zip';
import rimraf from 'rimraf';
import {getPath} from './utils';

const offlineChromeExtension = function(chromeStoreID) {
  const extensionsStore = getPath();
  const extensionFolder = path.resolve(`${extensionsStore}/${chromeStoreID}`);
  rimraf.sync(extensionFolder);

  return new Promise(function(resolve, reject) {
    zip.unzip(path.resolve(__dirname + `../extensions/${chromeStoreID}.crx`), extensionFolder, (err) => {
      if (err) reject(err);
      else resolve(extensionFolder);
    });
  });
};

export default offlineChromeExtension;
