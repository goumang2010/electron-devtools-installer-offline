import electron, {remote} from 'electron';
import fs from 'fs';
import path from 'path';
import zipkit from 'node-zipkit';
import rimraf from 'rimraf';

import downloadChromeExtension from './downloadChromeExtension';
import offlineChromeExtension from './offlineChromeExtension';
import {checkConfig, getPath, getIDMapPath} from './utils';

const installExtension = (chromeStoreID, forceDownload = false) => {
  return checkConfig().then(function(IDMap) {
    if (IDMap[chromeStoreID]
        && (remote || electron).BrowserWindow.getDevToolsExtensions
        && (remote || electron).BrowserWindow.getDevToolsExtensions().hasOwnProperty(IDMap[chromeStoreID]))
      return Promise.resolve(IDMap[chromeStoreID]);

    let promise = forceDownload ? downloadChromeExtension(chromeStoreID) : offlineChromeExtension(chromeStoreID);

    return promise.then((extensionPath) => {
      const extensionsStore = getPath();
      const extensionFolder = path.resolve(`${extensionsStore}/${chromeStoreID}`);
      rimraf.sync(extensionFolder);

      return new Promise(function(resolve, reject) {
        zipkit.unzip(extensionPath, extensionFolder, (err) => {
          if (err) reject(err);
          else {
            const name = (remote || electron).BrowserWindow.addDevToolsExtension(extensionFolder); // eslint-disable-line

            fs.writeFile(getIDMapPath()
                , JSON.stringify(Object.assign(IDMap, {
                  [chromeStoreID]: name
                }))
                , err => {
                  if (err) reject(err);
                  else resolve(extensionFolder);
                });
          }
        });
      });
    });
  });
};

export default installExtension;

export const EMBER_INSPECTOR = 'bmdblncegkenkacieihfhpjfppoconhi';
export const REACT_DEVELOPER_TOOLS = 'fmkadmapgofadopljbjfkapdkoienihi';
export const ANGULARJS_BATARANG = 'ighdmehidhipcmcojjgiloacoafjmpfk';
export const VUEJS_DEVTOOLS = 'nhdogjmejiglipccpnnnanhbledajbpd';
export const REDUX_DEVTOOLS = 'lmhkpmbekcpmknklioeibfkpmmfibljd';
