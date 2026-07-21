---

# Stage 6 – AI Rematch

## Objective

The final stage of this project compared my hand-built SQLite migration against an AI-generated implementation.

The goal was not to replace my implementation, but to evaluate whether an AI would independently arrive at similar engineering decisions while preserving the existing REST API.

To make the comparison fair, the AI was given a specification describing the required API behavior rather than my implementation. This allowed architectural decisions such as SQL structure, helper functions, update strategy, and internal organization to emerge naturally.

---

## Evaluation Method

The AI implementation was generated using a fresh conversation and stored separately from my working project.

The generated files were:

- `data/db.js`
- `data/devices.js`
- `routes/devices.js`

The AI implementation was tested in a separate copy of the project to avoid modifying my working solution.

Both implementations were evaluated using the same behavioral tests before comparing the source code.

---

## Behavioral Tests

The AI implementation successfully passed every functional test.

| Test | Result |
|-------|--------|
| Database created automatically | ✅ |
| Table created automatically | ✅ |
| Seed data inserted only when the table was empty | ✅ |
| GET /devices | ✅ |
| GET /devices/:id | ✅ |
| POST /devices | ✅ |
| PUT partial update | ✅ |
| DELETE /devices/:id | ✅ |
| POST validation (400) | ✅ |
| Unknown device (404) | ✅ |
| Data persisted after restart | ✅ |
| IDs continued increasing after deletion | ✅ |

After deleting a device with ID 10, creating another device produced ID 11, confirming that SQLite's `AUTOINCREMENT` behavior was preserved.

---

## Code Comparison

After confirming identical runtime behavior, I compared the AI implementation with my own using:

```bash
git diff --no-index data/db.js ai-version/db.js

git diff --no-index data/devices.js ai-version/devices.js

git diff --no-index routes/devices.js ai-version/routes-devices.js
```

This comparison highlighted several architectural differences despite both implementations producing the same API behavior.

---

## What the AI Did Better

The AI introduced several improvements that were not required by the assignment but improved maintainability and scalability.

These included:

- Using `path.join()` to create a platform-independent database path.
- Enabling SQLite foreign key support using `PRAGMA foreign_keys = ON`.
- Returning records ordered by ID using `ORDER BY id`.
- Introducing a whitelist of updateable fields before generating SQL.
- Dynamically generating `UPDATE` statements so only modified fields were written to the database.
- Centralizing route parameter validation through a reusable helper function.
- Validating malformed route IDs before querying the database.

These improvements reduced duplicated code while preserving the original REST API.

---

## What My Implementation Did Better

My implementation focused on clarity and maintainability.

Key strengths included:

- Clear documentation describing the responsibility of each architectural layer.
- Explicit SQL statements that are easy to follow.
- Object-based seed data that is easier to read and modify.
- Helpful initialization messages during first-time database creation.
- Straightforward CRUD logic that is easy for another developer or student to understand.

Although my implementation was more verbose, it prioritized readability over abstraction.

---

## What Both Implementations Did Equally Well

Both implementations:

- Preserved the original REST API.
- Used parameterized SQL queries.
- Automatically created the SQLite database.
- Created the table only when necessary.
- Seeded data only when the table was empty.
- Supported persistent storage across server restarts.
- Returned the same HTTP status codes.
- Passed all behavioral tests.

From the perspective of an API client, both implementations behaved identically.

---

## What the Prompt Left Unspecified

The prompt intentionally focused on API behavior rather than implementation details.

As a result, the AI independently made several architectural decisions, including:

- Database path construction.
- Use of SQLite pragmas.
- Dynamic versus fixed SQL updates.
- Helper function organization.
- Update field whitelisting.
- Internal code structure.

These differences became visible only after comparing the source code, demonstrating how multiple implementations can satisfy the same API contract while using different internal designs.

---

## Reflection

This comparison demonstrated an important software engineering principle:

A stable REST API allows the persistence layer to evolve without affecting clients.

Although the AI and my implementation differed internally, both preserved the same external behavior.

Completing this comparison reinforced the value of separating API behavior from implementation details and showed that software can have multiple correct implementations while making different engineering trade-offs between readability, abstraction, maintainability, and scalability.