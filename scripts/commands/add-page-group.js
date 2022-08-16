const fs = require('fs');
const path = require('path');
const { insertAtPos, insertAfter } = require('./_utils');


exports.command = 'add-page-group';

exports.describe = 'Add a group of semantically similar pages';

exports.builder = {
  name: {
    description: 'The name of the group',
    demandOption: true,
    type: 'string'
  }
};

const jsTemplates = {
  links:
`import { AppLink } from 'smart-react-routing';

const links = {
};

export default links;
`,

  index:
`import appRouting from '../config/appRouting';
import links from './links';

const routes = [
];

export default routes;
`
};

const tsTemplates = {
  links:
`import { AppLink } from 'smart-react-routing';

const links = {
};

export default links;
`,

  index:
`import appRouting from '../config/appRouting';
import links from './links';
import { AppRoute } from 'smart-react-routing';

const routes: AppRoute<unknown>[] = [
];

export default routes;
`
};

exports.handler = async argv => {
  const { root, ts, name } = argv;

  const groupDir = path.join(root, 'pages', name);
  await fs.promises.mkdir(groupDir, { recursive: true });

  const ext = ts ? 'ts' : 'js';
  const jsxExt = ts ? 'tsx' : 'js';
  const templates = ts ? tsTemplates : jsTemplates;

  const allLinksFilePath = path.join(root, 'pages', 'config', `links.${ext}`);
  await fs.promises.writeFile(path.join(groupDir, `links.${ext}`), templates.links);

  await insertAfter(allLinksFilePath, 'const links = {\n', `  ${name}: ${name}Links,\n`);
  await insertAtPos(allLinksFilePath, 0, `import ${name}Links from '../${name}/links';\n`);

  const pagesIndexFilePath = path.join(root, 'pages', `index.${jsxExt}`);
  await fs.promises.writeFile(path.join(groupDir, `index.${ext}`), templates.index);

  const routesIndicator = ts ? 'const routes: AppRoute<unknown>[] = [\n' : 'const routes = [\n';
  await insertAfter(pagesIndexFilePath, routesIndicator, `  ...${name}Routes,\n`);
  await insertAtPos(pagesIndexFilePath, 0, `import ${name}Routes from './${name}';\n`);
};
