import path from 'path';

const offlineChromeExtension = function(chromeStoreID) {
  return Promise.resolve(path.join(__dirname, `../extensions/${chromeStoreID}.crx`));
};

export default offlineChromeExtension;
