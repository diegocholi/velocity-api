// Template de rotas
const routesTemplate = (routeName, className) => `  {
    route: '/${routeName}',
    method: 'GET',
    handler: (req, res) => ${className}Controller.list(req, res),
  },
  {
    route: '/${routeName}/:id',
    method: 'GET',
    handler: (req, res) => ${className}Controller.get(req, res),
  },
  {
    route: '/${routeName}',
    method: 'POST',
    handler: (req, res) => ${className}Controller.post(req, res),
  },
  {
    route: '/${routeName}/:id',
    method: 'PATCH',
    handler: (req, res) => ${className}Controller.update(req, res),
  },
  {
    route: '/${routeName}/:id',
    method: 'DELETE',
    handler: (req, res) => ${className}Controller.delete(req, res),
  },`

// Template de arquivo de rotas
const fileRouteTemplate = (
  type
) => `import { IRoute } from '../../interfaces/IRoute'

export default [
  // ${type} routes
] as IRoute[]`

module.exports = {
  fileRouteTemplate,
  routesTemplate,
}
