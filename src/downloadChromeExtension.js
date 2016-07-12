import fs from 'fs';
import path from 'path';
import request from 'request';
import rimraf from 'rimraf';
import zip from 'cross-zip';

import {getPath} from './utils';

const downloadChromeExtension = (chromeStoreID, attempts = 5) => {
  const extensionsStore = getPath();
  const extensionFolder = path.resolve(`${extensionsStore}/${chromeStoreID}`);
  rimraf.sync(extensionFolder);

  return new Promise((resolve, reject) => {
    const fileURL = `https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D${chromeStoreID}%26uc&prodversion=32`; // eslint-disable-line
    const download = fs.createWriteStream(path.resolve(`${extensionFolder}.crx`));
    request({
      url: fileURL,
      followAllRedirects: true,
      timeout: 10000,
      gzip: true
    })
        .on('error', (err) => {
          console.log(`Failed to fetch extension, trying ${attempts - 1} more times`);
          if (attempts <= 1) {
            return reject(err);
          }
          setTimeout(() => {
            downloadChromeExtension(chromeStoreID, attempts - 1)
                .then(resolve)
                .catch(reject);
          }, 200);
        })
        .pipe(download)
        .on('close', () => {
          zip.unzip(path.resolve(`${extensionFolder}.crx`), extensionFolder, (err) => {
            if (err) reject(err);
            else resolve(extensionFolder);
          });
        });
  });
};


export default downloadChromeExtension;
