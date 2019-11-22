import fs from 'fs';

class Storage {
  setItem(key, value) {
    const dest = './tmp/' + key + '.json';
    fs.writeFileSync(dest, value);
  }

  getItem(key) {
    const dest = './tmp/' + key + '.json';
    try {
      return fs.readFileSync(dest, 'utf8');
    } catch (e) {
      return null;
    }
  }
}

export default Storage;
