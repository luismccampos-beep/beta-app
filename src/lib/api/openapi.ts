export interface OpenAPIRoute {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  tags?: string[];
  parameters?: unknown[];
  requestBody?: unknown;
  responses: Record<string, unknown>;
}

const routes: OpenAPIRoute[] = [];

export function registerRoute(route: OpenAPIRoute): void {
  routes.push(route);
}

export function getOpenAPISpec(baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') {
  const paths: Record<string, unknown> = {};

  for (const r of routes) {
    if (!paths[r.path]) paths[r.path] = {};
    (paths[r.path] as Record<string, unknown>)[r.method.toLowerCase()] = {
      summary: r.summary,
      tags: r.tags,
      parameters: r.parameters,
      requestBody: r.requestBody,
      responses: r.responses,
    };
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'Beta App API',
      version: '1.0.0',
      description: 'Travel platform API',
    },
    servers: [{ url: baseUrl }],
    paths,
  };
}
