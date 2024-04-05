# Backend
Our backend is built using Express.js and TypeScript. It incorporates ESLint for code quality, Jest for testing, and ts-node-dev for an enhanced development experience.

## Getting Started
Follow these instructions to set up your project locally for development and testing purposes.

### Prerequisites
Ensure you have Node.js installed on your machine. This project was built using Node.js version 18.x or newer.

### Installation
Install the necessary dependencies:

```sh
cd ./backend
npm install
```

### Configuration
1. Set up your environment variables: 
Create a .env file in the root directory, all key-value pairs set in the `.env.example` file are required to make the service run. Adjust environment-specific variables based on your local setup.

## Usage
### Development Mode
Start the development server with hot reload:

```npm run dev```

*This command uses ts-node-dev to run the application, automatically restarting the server upon detecting file changes.*

### Production Build
Compile TypeScript code to JavaScript using TSC (Typescript Compiler):

```npm run build```
*The compiled files will be output to the ./dist directory.*

### Start Production Server
After building, start the server from the compiled code:

```npm start```

## Code Quality
### Testing
Run tests using Jest:

```npm run test```

### Linting
We are using ESlint as linter for our backend. Please make sure to format the code as required by ESlint. This can be done automatially using the following commands or by installing the extensions recommended for VScode.

Check for linting errors:

```npm run lint```

Automatically fix linting errors:

```npm run lint:fix```