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

