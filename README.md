# UniVault Notes Service

### Installing Dependencies

To install all the required dependencies and development dependencies for the Notes Adapter Fork UniVault project, you can use the following command:

```bash
npm run install:all
```

### Environment Variables

This project uses a `.env.dev` file to manage configuration settings. Below is the structure and default values for the environment variables.

### Configuration

Create a `.env.dev` file in the root of your project with the following content:

```
# General
ENV=development
PORT=XXXX
SERVER_URL=http://localhost:PORT

# Service Endpoints
AUTH_URL=http://localhost:PORT/URL
```

## Database Connection

To connect your application to the database, you need to configure the `DATABASE_URL` environment variable. This variable specifies the connection string for your database.

### Configuration

Add the following line to your `.env` file in the root of your project:

```plaintext
DATABASE_URL=<your-database-connection-string>

```

## Building TypeScript

To compile your TypeScript files, you can use the TypeScript compiler (`tsc`). You can run it directly using `npx`, which executes the binary without installing it globally.

### Using `npx tsc`

Run the following command to build your TypeScript files:

```bash
npx tsc
```
 ## Running the Project

To start the development server, use the following command:

```bash
npm run dev
```

# Important :  Modifying Type Definitions for Express

To customize the type definitions for Express in your project, follow these steps:

1. **Locate the Type Definitions**:
   Navigate to the `node_modules/@types/express` directory in your project.

2. **Edit `index.d.ts`**:
   Open the `index.d.ts` file within the `express` folder.

3. **Add Custom Code**:
   Insert the following code at the top of the file:

   ```typescript
   import * as express from "express";

   declare global {
       namespace Express {
           interface Request {
               ops: {
                   id: string;
                   allow: string[];
                   map: any;
               };

               user: {
                   'user-type': string;
               };
           }
       };
   }
