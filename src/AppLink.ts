import { stringify } from 'query-string';

export type LinkParameter = string | number;

class AppLink {
  path: string;
  constructor(path: string) {
    this.path = path;
  }

  compose(...params: [...LinkParameter[], Record<string, any> | LinkParameter]): string {
    const pathParts = this.path.split(/(?<!\\)\//);
    let paramIdx = 0;
    const withPathParams = pathParts.map(part => part.startsWith(':') ? params[paramIdx++] : part).join('/');
    if (paramIdx >= params.length) {
      return withPathParams;
    }

    return `${withPathParams}/?${stringify(params[params.length - 1] as Record<string, any>)}`;
  }
}

export default AppLink;