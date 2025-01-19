# SP-Test: Simple TypeScript Testing Library

SP-Test is a lightweight, standalone TypeScript testing library focused on simplicity and ease of use. It provides a flexible way to organize and run tests with minimal configuration required.

## Key Features

- Zero dependencies
- Minimal configuration needed
- Concurrent test bundle execution
- Built-in equality assertions
- Asynchronous test support
- Before/After hooks at multiple levels
- Colored console output for better readability

## Installation

```bash
npm install sp-test
```

## Quick Start

Here's a simple example of how to use SP-Test:

```typescript
import { createNewBoundle, addTestBundle, runAllTest, evaluateEquality } from 'sp-test';

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
- Limited built-in assertion methods
- API names may change in future versions
- No built-in mocking system

## Upcoming Features

- Additional evaluation methods
- Improved naming conventions (inspired by Jest)
- Partial bundle execution support
- Enhanced logging system
- More configuration options

## Contributing

Feel free to submit issues and enhancement requests. This library is under active development, and we welcome community contributions.

## License

[Add your chosen license here]
