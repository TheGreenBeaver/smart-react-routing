const fs = require('fs');
const path = require('path');
const { insertAtPos, insertAfter } = require('./_utils');

exports.command = 'add-page';

exports.describe = 'Add a new page';

exports.builder = {
  group: {
    description: 'The group to which the page belongs',
    type: 'string',
    demandOption: true
  },
  name: {
    description: 'The name of the page',
    demandOption: true,
    type: 'string'
  },
  url: {
    description: 'Path to the page (used to create a corresponding AppLink)',
    demandOption: true,
    type: 'string'
  }
};

const jsTemplates = {
  getPageFileContent: name =>
`function ${name}() {
  return <div />;
}

export default ${name};
`,

  getIndexFileContent: name => `export { default } from './${name}';`
};

const tsTemplates = {
  getPageFileContent: name =>
`import { FC } from 'react';

const ${name}: FC = () => {
  return <div />;
}

export default ${name};
`,

  getIndexFileContent: name => `export { default } from './${name}';`
};

exports.handler = async argv => {
  const { root, ts, group, name, url } = argv;

  const ext = ts ? 'ts' : 'js';
  const jsxExt = ts ? 'tsx' : 'js';
  const templates = ts ? tsTemplates : jsTemplates;

  const camelCase = `${name[0].toLowerCase()}${name.substring(1)}`;

  const groupDir = path.join(root, 'pages', group);

  try {
    await fs.promises.access(groupDir, fs.constants.F_OK);
  } catch {
    console.log(`No such group: ${group}`);
    return;
  }

  const pageDir = path.join(groupDir, name);

  await fs.promises.mkdir(pageDir, { recursive: true });
  await fs.promises.writeFile(path.join(pageDir, `${name}.${jsxExt}`), templates.getPageFileContent(name));
  await fs.promises.writeFile(path.join(pageDir, `index.${ext}`), templates.getIndexFileContent(name));

  await insertAfter(
    path.join(groupDir, `links.${ext}`),
    'const links = {\n',
    `  ${camelCase}: new AppLink('${url}'),\n`,
  );
  await insertAtPos(
    path.join(groupDir, `index.${ext}`),
    0,
    `import ${name} from './${name}';\n`,
  );
  const routesIndicator = ts ? 'const routes: AppRoute<unknown>[] = [\n' : 'const routes = [\n';
  await insertAfter(
    path.join(groupDir, `index.${ext}`),
    routesIndicator,
    `  appRouting.createAppRoute(links.${camelCase}, ${name}, {}),\n`,
  );
};
