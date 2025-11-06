# 1. Kickstart Your TypeScript Set Up
## 1.1. TypeScript's Relationship with JavaScript
## 1.2. JavaScript vs. TypeScript in the Build Process
## 1.3. Essential Tools for TypeScript Development
## 1.4. Set up Node.js and VS Code
## 1.5. Installing pnpm for Package Management
## 1.6. Installing the Total TypeScript VS Code Extension

---
# 2. TypeScript in The Build Process
## 2.1. Unexpected Token Error in the Browser
## 2.2. Convert a TypeScript File into a JavaScript File
## 2.3. Automating TypeScript Compilation
## 2.4. Compiling TypeScript Files to a Directory
## 2.5. Use Vite for a Frontend App with TypeScript
## 2.6. Comparing Vite with tsc
## 2.7. TypeScript in a CI/CD System
## 2.8. Should TypeScript Block Your Dev Server?
## 2.9. Quickly Create Scripts with tsx

---
# 3. Essential Types And Notations
## 3.1. Understanding Function Errors
## 3.2. Annotating Empty Parameters
## 3.3. Basic Types in TypeScript
## 3.4. Optional Function Parameters
## 3.5. Default Parameters in JavaScript Functions
## 3.6. Typing Object Literals
## 3.7. Making Object Property Types Optional
## 3.8. A Single Source of Truth for Type Definitions
## 3.9. Add an Array to an Object
## 3.10. Arrays of Objects in TypeScript
## 3.11. Rest Parameters in TypeScript
## 3.12. Tuples for Precise Array Structures in TypeScript
## 3.13. Using Optional Tuple Members in TypeScript
## 3.14. The Controversial `any` Type
## 3.15. Function Types
## 3.16. Typing an Event Listener
## 3.17. Restricting `Set` Types
## 3.18. Type Checking Maps
## 3.19. Debugging JSON Parsing
## 3.20. Typing Fetch API Responses in Async Functions

---
# 4. Integrated Development Environments Superpowers
## 4.1. Understanding How TypeScript Works in Your IDE
## 4.2. Introspecting Variables and Declarations in TypeScript
## 4.3. Hovering Over a Function Call
## 4.4. Adding Documentation for Hovers
## 4.5. Manually Triggering Autocomplete
## 4.6. TypeScript's Approach to Errors
## 4.7. Quick Renaming in VS Code
## 4.8. Navigating Code with "Go to Definition"
## 4.9. Fast Imports in VS Code
## 4.10. Organizing Imports in Large Files
## 4.11. Quick Fix Refactoring
## 4.12. Automatic Code Formatting with Prettier
## 4.13. Restarting the TypeScript Server in VS Code

---
# 5. Unions and Narrowing
## 5.1. Handling Null Values in TypeScript
## 5.2. Diving Deeper into Unions and Assignability
## 5.3. Restricting Function Parameters
## 5.4. Literal Type Assignability
## 5.5. Combining Union Types in TypeScript
## 5.6. How Big Can a Union Be?
## 5.7. Resolving Literal Types to Wider Types
## 5.8. Narrowing Unions with `typeof`
## 5.9. Conditional Narrowing in TypeScript
## 5.10. Narrowing with Boolean Won't Work
## 5.11. Gotchas When Narrowing a Map in TypeScript
## 5.12. Narrowing by Throwing Errors
## 5.13. Narrowing with `in` Statements
## 5.14. Introducing the Unknown Type in TypeScript
## 5.15. Dealing with Unknown Errors in TypeScript
## 5.16. Narrowing Unknown in a Large Conditional Statement
## 5.17. Introducing the `never` Type in TypeScript
## 5.18. Solving the Never Type in TypeScript
## 5.19. Narrowing Return Types with TypeScript
## 5.20. Narrowing in Different Scopes
## 5.21. Reusable Type Guards
## 5.22. Handling Separate But Related Types
## 5.23. Destructuring a Discriminated Union in TypeScript
## 5.24. Narrowing a Discriminated Union with a Switch
## 5.25. The switch (true) Pattern in TypeScript
## 5.26. Refining Types with Discriminated Unions of Tuples
## 5.27. Discriminated Booleans
## 5.28. Adding Defaults to a Discriminated Union
## 5.29. Should You Provide Function Return Types?

---
# 6. Objects
## 6.1. Extending Objects in TypeScript
## 6.2. Extend an Object Using Interfaces in TypeScript
## 6.3. Extending Incompatible Properties
## 6.4. Comparing Intersection and Interface Extends in TypeScript
## 6.5. Allow Dynamic Keys in TypeScript Types
## 6.6. Allow Any String Key while Supporting Default Properties
## 6.7. Supporting Different Types of Keys in TypeScript
## 6.8. Restricting Object Keys in TypeScript
## 6.9. An Issue with Duplicate Interfaces
## 6.10. Working with Partial Data from a Type
## 6.11. Exclude a Property from an Interface
## 6.12. A Quirk of Omit in TypeScript
## 6.13. Understanding Distributive Omit and Pick in TypeScript
## 6.14. Excluding Fields from a TypeScript Type
## 6.15. Making Type Properties Required in TypeScript
## 6.16. Specifying a Type with Shared Properties in TypeScript

---
# 7. Mutability
## 7.1. Fixing a Type Assignment Inference Error
## 7.2. Object Property Inference
## 7.3. Creating Read-only Properties
## 7.4. Using a Type Helper to Create Read-only Properties
## 7.5. Deeply Apply Read-only Properties to an Object in TypeScript
## 7.6. Comparing Object.freeze with as const
## 7.7. Prevent Array Mutation in TypeScript
## 7.8. Distinguishing Assignability Between Read-Only and Mutable Arrays
## 7.9. Fixing Unsafe Tuples
## 7.10. Use the ts-reset Library to Improve Readonly Array Handling in TypeScript
## 7.11. Improve Type Inference for an Async Function
## 7.12. Infer Strings as Their Literal Types in Objects with as const

---
# 8. Typescript Classes
## 8.1. Classes in TypeScript
## 8.2. Implement Class Methods in TypeScript
## 8.3. Creating Constructors for Classes in TypeScript
## 8.4. Getter Methods in TypeScript
## 8.5. Public and Private Properties in TypeScript
## 8.6. Setter Methods in TypeScript
## 8.7. Extending Classes in TypeScript
## 8.8. Overriding Methods in TypeScript
## 8.9. Ensure a Class Adheres to a Contract
## 8.10. Using `this` in Functions and Objects

---
# 9. TypeScript Only Features
## 9.1. Intro to TypeScript-only Features
## 9.2. Parameter Properties in TypeScript
## 9.3. Working with Enums in TypeScript
## 9.4. String Enums in TypeScript
## 9.5. Const Enums in TypeScript
## 9.6. Namespaces in TypeScript
## 9.7. Merging Namespaces in TypeScript
## 9.8. Declaration Merging with Interfaces Inside of Namespaces
## 9.9. When to Prefer ES Features to TS Features

---
# 10. Deriving Types From Values
## 10.1. Introduction to Deriving Types in TypeScript
## 10.2. The keyof Operator
## 10.3. The typeof Operator
## 10.4. No Creating Runtime Values from Types
## 10.5. Deriving Types with Classes
## 10.6. Enums as Types and Values in TypeScript
## 10.7. The this Keyword in TypeScript
## 10.8. Using the Same Name for Values and Types in TypeScript
## 10.9. Creating Types from Complex Function Parameters
## 10.10. Extracting Return Types from Functions
## 10.11. Extract the Return Type from an Async Function
## 10.12. Access Specific Values in an as const Object
## 10.13. Pass a Union to an Indexed Access Type
## 10.14. Extract a Union of All Values from an Object
## 10.15. Create a Union from an as const Array

---
# 11. Annotations and Assertions
## 11.1. Required vs Unnecessary Annotations
## 11.2. Provide Additional Information to TypeScript
## 11.3. Global Typings use any
## 11.4. The Limits of as in TypeScript
## 11.5. Non-null Assertions
## 11.6. The @ts-ignore Directive in TypeScript
## 11.7. The @ts-expect-error Directive in TypeScript
## 11.8. The @ts-nocheck Directive in TypeScript
## 11.9. Improve Type Annotations with the satisfies Operator
## 11.10. Using satisfies with keyof and typeof in TypeScript
## 11.11. Comparing as, satisfies, and Variable Annotations in TypeScript
## 11.12. The satisfies Keyword and Deeply Read-Only Objects in TypeScript

---
# 12. The Weird Parts of TypeScript
## 12.1. Accept Anything Except Null or Undefined
## 12.2. Typing a Truly Empty Object
## 12.3. Excess Property Warnings in TypeScript
## 12.4. Excess Properties in Functions
## 12.5. Object.keys and Object.entries in TypeScript
## 12.6. Iterating Over Object Keys in TypeScript
## 12.7. Evolving Types using the `any` type
## 12.8. The Evolving `any` and Arrays
## 12.9. Function Parameter Comparisons in TypeScript
## 12.10. Typing Functions with Object Params
## 12.11. Properly Typing an Object of Functions
## 12.12. Unions of Function Return Types
## 12.13. Annotating the Errors Thrown by a Function

---
# 13. Modules Scripts and Declaration Files
## 13.1. Understanding Modules and Scripts in TypeScript
## 13.2. Enforcing Module Usage in TypeScript
## 13.3. Declaration Files in TypeScript
## 13.4. Declaration Files Can Be Modules or Scripts
## 13.5. Using Declaration Files with JavaScript in TypeScript
## 13.6. Type Variables Declared Elsewhere
## 13.7. Global Scope Declarations in TypeScript

---
# 14. Types You Don't Control
## 14.1. Configuring the lib Compiler Option
## 14.2. DOM Typing Configuration in TypeScript
## 14.3. Update DOM Typing to Include Iterable
## 14.4. Modifying TypeScript Global Scope
## 14.5. Adding Type Definitions for External Libraries
## 14.6. Integrating TypeScript with Node
## 14.7. Modifying process.env Typing in TypeScript
## 14.8. Types that Ship With Libraries
## 14.9. Declaring Module Types in TypeScript
## 14.10. Importing and Typing Non-Code Files in TypeScript
## 14.11. TSConfig Options and Declaration Files
## 14.12. Should You Use Declaration Files to Store Your Types?

---
# 15. Configuring TypeScript
## 15.1. Recommended Base Configuration
## 15.2. Understanding Isolated Modules in TypeScript
## 15.3. Index Access Settings
## 15.4. Using TypeScript as a Linter
## 15.5. Module NodeNext with Extensions
## 15.6. The moduleResolution Option in tsconfig.json
## 15.7. NodeNext vs. Preserve Module Resolution in TypeScript
## 15.8. Enforcing Import Syntax
## 15.9. Verbatim Module Syntax Enforces Import Type
## 15.10. Understanding lib and target in TypeScript Configuration
## 15.11. Bundle Your Code for Library Use
## 15.12. Navigate to Source Files Instead of Declaration Files
## 15.13. Configure JSX Support in TypeScript
## 15.14. Multiple TypeScript Configurations
## 15.15. Globals are Tied to a Single Configuration
## 15.16. Share Configuration Across Multiple tsconfig Files
## 15.17. TypeScript Project References

---
# 16. Designing Your Types
## 16.1. Designing Your Types
## 16.2. Introduction to Generic Types
## 16.3. Generics with Multiple Type Parameters
## 16.4. Handle Errors with a Generic Result Type
## 16.5. Default Type Parameters in Generics
## 16.6. Add Constraints to a Type Parameter
## 16.7. Build a Stricter Omit Type
## 16.8. Template Literal Types in TypeScript
## 16.9. Represent All Possible Type Combinations with Template Literals
## 16.10. Derive Types with Mapped Types
## 16.11. Remapping Keys in TypeScript Map Types

---
# 17. The Utils Folder
## 17.1. Introduction to the Utilities Folder
## 17.2. Generic Functions Without Inference
## 17.3. Default Parameter Types for Generic Functions
## 17.4. Inference in Generic Functions
## 17.5. Type Parameter Constraints with Generic Functions
## 17.6. Combining Generic Types with Generic Functions
## 17.7. Multiple Type Arguments in Generic Functions
## 17.8. Using Type Predicates to Create Reusable Type Guards
## 17.9. Understanding Assertion Functions in TypeScript
## 17.10. Adapt a Function to Handle Different Types of Arguments