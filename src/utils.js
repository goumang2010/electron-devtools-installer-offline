import electron, {remote} from 'electron';
import fs from 'fs';
import path from 'path';

export const checkConfig = () => {
  const extensionsStore = getPath();

  return new Promise(function(resolve, reject) {
    fs.stat(extensionsStore, (err) => {
      if (err)
        fs.mkdir(extensionsStore, (err) => {
          if (err) reject(err);
          else resolve(extensionsStore)
        });
      else
        resolve(extensionsStore);
    });
  }).then(function(extensionsStore) {
    return new Promise(function(resolve, reject) {
      fs.readFile(path.resolve(extensionsStore, 'IDMap.json'), 'utf8', function(err, data) {
        if (err) resolve({});
        else resolve(data);
      });
    });
  });
};

export const getPath = () => {
  const savePath = (remote || electron).app.getPath('userData');
  return path.resolve(`${savePath}/extensions`);
};

export const getIDMapPath = () => {
  const extensionsStore = getPath();
  return path.resolve(extensionsStore, 'IDMap.json');
};