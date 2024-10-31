
---

# UniVault Notes Service

### Installing Dependencies

To install all required dependencies and development dependencies for the Notes Adapter Fork UniVault project, run the following command:

```bash
npm run install:all
```

### Environment Variables

This project uses a `.env.dev` file to manage configuration settings. Below is the structure and default values for the environment variables.

### Configuration

Create a `.env.dev` file in the root of your project with the following content:

```plaintext
# General
ENV=development
PORT=XXXX
SERVER_URL=http://localhost:PORT

# Service Endpoints
AUTH_URL=http://localhost:PORT/URL
```

### Database Connection

To connect your application to the database, you need to configure the `DATABASE_URL` environment variable. This variable specifies the connection string for your database.

### Configuration

Add the following line to your `.env` file in the root of your project:

```plaintext
DATABASE_URL=<your-database-connection-string>
```

### Building TypeScript

To compile your TypeScript files, use the TypeScript compiler (`tsc`). You can run it directly using `npx`, which executes the binary without installing it globally.

#### Using `npx tsc`

Run the following command to build your TypeScript files:

```bash
npx tsc
```

### Running the Project

To start the development server, use the following command:

```bash
npm run dev
```

### Generating Prisma Client & Schema Generation

To generate the required schema and Prisma client, run the following command:

```bash
npx prisma generate
```

---

