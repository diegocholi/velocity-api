# velocity-api

Velocity API is a modern API development framework designed to maximize developer productivity and efficiency. It offers a variety of ready-to-use tools that simplify the creation, maintenance, and expansion of robust backend applications.

## Main Features

- Automated Structure: With commands such as make:files, the framework allows the automatic generation of essential files such as DAOs, controllers and routes, reducing initial overhead and accelerating the development process.

- Performance-Driven: Built on performant technologies such as Node.js and Fastify, the Velocity API is optimized to handle high traffic loads, ensuring fast and efficient responses.

- Scale Flexibility: The framework structure is designed to support small to large applications, with easy horizontal and vertical scalability.

- Database Integration: Integrated support for database operations with dedicated scripts for migrations and table management, facilitating schema and data management.

- Security and Privacy: With options for public and private routes, the framework ensures that APIs can be secure and trustworthy, with easy implementations of authentication and authorization.

## Ideal for

Developers looking for an agile and reliable solution to build and manage RESTful APIs, with a focus on performance and ease of use. Whether for startup projects, enterprise applications or personal systems, Velocity API provides a solid foundation for any backend project.

# Getting started

To start the project you must:

- Clone this repository.
- Download dependencies:

  ```bash
  npm install
  ```

- Configure the `.env` environment variables, in the root of the project there is a file called `.env.exemple` that can be a starting point.

- Run the `migrate` command to create the database and migration structure

  ```bash
  npm run migrate
  ```

- To create a new migrate use the `make:migration` command. It will create a new SQL file in the `database/migrations` folder and you can manipulate the database through it. After writing your `.sql` file, simply run the `migrate` command again to execute the SQL commands.

  ```bash
  npm run make:migration MigrationName
  ```

# Command `make:files`

The `make:files` command is a tool from the `velocity-api` framework that automates the creation of essential files for developing an API, including DAOs, controllers and routes. This command makes it easier to maintain consistency and standards throughout your project.

## Description

This command interacts directly with the user through the console to collect necessary information such as the class name, database table name and the API version where the files should be created. Based on this information, it automatically generates the DAO, controller, and routes files as specified.

## Uso

To run the `make:files` command, use the following script in the terminal:

```bash
npm run make:files
```

### Execution Flow

1. Information Collection:

   - Prompts for the class name.
   - Asks for the name of the database table.
   - Asks about the API version for which files should be created.
   - Asks whether routes should be created and collects additional information about them.

2. File Generation:
   - DAO (Data Access Object): TypeScript file for database operations.
   - Controller: TypeScript file that handles business logic.
   - Routes: TypeScript files for API routing, created based on whether they need to be public or private.

### Examples of Generated Files

#### DAO

The generated DAO file follows the standard template for database operations, ensuring an efficient and reusable abstraction of data access

```typescript
import BaseDAO from '../../../bases/BaseDAO'

class ExampleDAO extends BaseDAO {
  private static _instance: ExampleDAO = new ExampleDAO()
  public static get instance(): ExampleDAO {
    return this._instance
  }

  private constructor() {
    super('example_table')
  }
}

export default ExampleDAO.instance
```

#### Controlador

The controller uses the DAO to perform operations, encapsulating entity-specific business logic.

```typescript
import ExampleDAO from '../../dao/v1/ExampleDAO'
import BaseController from '../../../bases/BaseController'

class ExampleController extends BaseController {
  private static _instance: ExampleController = new ExampleController()
  public static get instance(): ExampleController {
    return this._instance
  }

  private constructor() {
    super(ExampleDAO)
  }
}

export default ExampleController.instance
```

#### Rotas

Routes define the API endpoints and associate each route with a specific method in the controller.

```typescript
import { IRoute } from '../../interfaces/IRoute'
import ExampleController from '../../src/controllers/v1/ExampleController'

export default [
  {
    route: '/example',
    method: 'GET',
    handler: (req, res) => ExampleController.list(req, res),
  },
  {
    route: '/example/:id',
    method: 'GET',
    handler: (req, res) => ExampleController.get(req, res),
  },
  {
    route: '/example',
    method: 'POST',
    handler: (req, res) => ExampleController.post(req, res),
  },
  {
    route: '/example/:id',
    method: 'PATCH',
    handler: (req, res) => ExampleController.update(req, res),
  },
  {
    route: '/example/:id',
    method: 'DELETE',
    handler: (req, res) => ExampleController.delete(req, res),
  },
  // More routes here...
] as IRoute[]
```

#### Considerations

This command is a crucial part of the `velocity-api` development infrastructure, intended to improve the efficiency of project development and maintenance.
