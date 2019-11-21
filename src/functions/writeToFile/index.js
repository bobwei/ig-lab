import fs from 'fs';
import * as R from 'ramda';

const writeToFile = (outputPath, content) => {
  fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
  return content;
};

export default R.curry(writeToFile);
