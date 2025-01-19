# SP-TS-Test: Simple TypeScript Testing Library

SP-Test is a lightweight, standalone TypeScript testing library focused on simplicity and ease of use. It provides a flexible way to organize and run tests with minimal configuration required.

## Key Features

- Zero dependencies
- Zero configuration needed
- Concurrent test bundle execution
- Built-in equality assertions
- Asynchronous test support
- Before/After callbacks at multiple levels: global, boundle and between tests
- Colored console output for better readability

## Installation

```bash
npm install -d sp-ts-test
```

## Quick Start

Here's a simple example of how to use SP-Test:

```typescript
import { createNewBoundle, addTestBundle, runAllTest, evaluateEquality } from 'sp-ts-test';

// Create a test bundle
const userTests = createNewBoundle("User Operations")
  .addTest("should create user", () => {
    const user = { name: "John", age: 30 };
    evaluateEquality(user, { name: "John", age: 30 });
  })
  .addTest("should update user age", () => {
    const user = { name: "John", age: 31 };
    evaluateEquality(user.age, 31);
  });

// Add bundle to manager and run tests
addTestBundle(userTests);
runAllTest();
```

## Core Concepts

### Test Bundles

A test bundle is a collection of related tests that can be executed independently from other bundles. Each bundle can have its own setup and teardown procedures.

### Test Manager

The Test Manager is a singleton that orchestrates the execution of all test bundles. It provides global before/after hooks and handles concurrent bundle execution.

## API Reference

### Test Bundle Creation and Management

#### `createNewBoundle(name: string)`
Creates a new test bundle with the specified name.
```typescript
const myBundle = createNewBoundle("Authentication Tests");
```

#### `addTestBundle(bundle: BoundleTester)`
Adds a test bundle to the Test Manager for execution.
```typescript
addTestBundle(myBundle);
```

#### `runAllTest()`
Executes all registered test bundles concurrently.

### Test Bundle Configuration Methods

#### `beforeThisBoundle(fn: () => void | Promise<void>)`
Defines a function to run before executing the bundle's tests.

#### `aftherThisBoundle(fn: () => void | Promise<void>)`
Defines a function to run after executing all bundle's tests.

#### `beforeEachTest(fn: () => void | Promise<void>)`
Defines a function to run before each test in the bundle.

#### `aftherEachTest(fn: () => void | Promise<void>)`
Defines a function to run after each test in the bundle.

#### `addTest(name: string, testFn: () => any)`
Adds a test to the bundle.

### Global Hooks

#### `beforeAllBoundles(fn: BeforeAllBoundles)`
Defines a function to run before any test bundles are executed.
```typescript
beforeAllBoundles(() => {
  console.log("Starting all test bundles");
});
```

#### `aftherAllBoundles(fn: AftherAllBoundles)`
Defines a function to run after all test bundles have completed.

### Assertions

#### `evaluateEquality(obj1: any, obj2: any, errMsg?: string)`
Compares two values for deep equality. Throws an error with an optional custom message if values are not equal.
```typescript
evaluateEquality(result, expectedValue, "Values should match");
```

## Best Practices

1. Keep test bundles focused on specific functionality
2. Use meaningful bundle and test names
3. Keep bundles independent of each other
4. Use before/after hooks for setup and cleanup
5. Provide descriptive error messages in evaluateEquality calls

## Limitations

- Not optimized for very large test suites
- Limited built-in assertion methods (i will create more method like the current assertEquality())
- API names may change in future versions
- No built-in mocking system

## Upcoming Features

- Additional evaluation methods
- Improved naming conventions (inspired by Jest)
- Partial bundle execution support
- Enhanced logging system
- More configuration options

## Project Setup Guide

SP-TS-Test is designed to work seamlessly with TypeScript projects. Here's our recommended setup structure that we've found works well in practice:

### 1. Package Configuration

Add the test script to your `package.json`:

```json
{
  "scripts": {
    "test": "ts-node ./test/entrypoint.ts"
  },
  "devDependencies": {
    "sp-ts-test": "^1.0.0",
    "ts-node": "^10.0.0"
  }
}
```

### 2. Project Structure

We recommend organizing your tests in a hierarchical structure:

```
your-project/
├── src/
│   └── [your source files]
├── test/
│   ├── entrypoint.ts
│   ├── db-config.ts (optional)
│   └── user/
│       ├── user.test1.ts
│       └── user.test2.ts
```

### 3. Test Entry Point

Create an `entrypoint.ts` file that serves as the main test orchestrator. Here's an example using Express.js:

```typescript
import {
  addTestBundle,
  aftherAllBoundles,
  beforeAllBoundles,
  runAllTest,
} from "sp-ts-test";
import express, { Express } from "express";
import { USER_TEST_BUNDLE } from "./user/user.test1";

// Global test application instance
export let TEST_APP: Express = express();

// Setup global test environment
beforeAllBoundles(async () => {
  await initializeTestDatabase();
  TEST_APP = createTestApp();
});

// Register test bundles
addTestBundle(USER_TEST_BUNDLE);

// Cleanup after all tests
aftherAllBoundles(async () => {
  await cleanupTestDatabase();
  process.exit(0);
});

// Execute all tests
runAllTest();
```

### 4. Individual Test Files

Create separate test files for different features. Example of a user test file:

```typescript
import { createNewBoundle, evaluateEquality } from "sp-ts-test";
import { TEST_APP } from "../entrypoint";
import request from "supertest";

export const USER_TEST_BUNDLE = createNewBoundle("User API Tests")
  .addTest("GET /api/user should return correct response", () =>
    request(TEST_APP)
      .get("/api/user/")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        evaluateEquality(response.body, {
          message: "Success",
          data: expect.any(Object)
        });
      })
  )
  .beforeThisBoundle(async () => {
    // Setup specific to user tests
    await seedUserTestData();
  });
```

This structure allows you to:
- Keep tests organized by feature
- Share test utilities and configurations
- Run tests in isolation or as part of the full suite
- Maintain clear separation between test and production code

## Contributing

Feel free to submit issues and enhancement requests. This library is under active development, and we welcome community contributions. Please note that this project is intended to remain simple and focused on its core testing capabilities.

## License

MIT License

Copyright (c) [Year] [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Note: While the MIT License allows commercial use, we strongly encourage users to maintain the open-source nature of derivative works and contribute improvements back to the community.
