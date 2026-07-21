---

# Stage 6 – AI Rematch

## Objective

The final stage compared my hand-built SQLite migration against an independently AI-generated implementation of the same migration to evaluate whether an AI would arrive at similar architectural decisions without being shown my implementation or the issues I discovered while building it.

---

## Prompt

The AI was given a specification describing the required REST API behavior but was not shown my source code, README, or implementation history.

The prompt specified:

- Express.js using the `better-sqlite3` library.
- A SQLite `devices` table containing:
  - `id`
  - `name`
  - `model`
  - `manufacturer`
  - `location`
  - `status`
  - `lastServiceDate`
- Automatic table creation.
- Seeding exactly three devices only when the table is empty.
- Preservation of the existing REST API.
- Parameterized SQL queries.
- Persistent storage across server restarts.
- Complete implementations of:
  - `data/db.js`
  - `data/devices.js`
  - `routes/devices.js`

Two implementation decisions were intentionally left unspecified:

- how identifiers should behave after a deletion
- where default-value logic should live

These were intentionally omitted so the AI could make its own engineering decisions rather than simply following instructions that mirrored my implementation.

---

## Evaluation Method

The AI-generated files were stored inside the `ai-version/` directory and tested using a completely separate copy of the project. This ensured the AI implementation could be evaluated without modifying my working solution.

During the comparison I first inspected the AI-generated source code to identify implementation choices and form specific predictions. I then confirmed those predictions through runtime testing under matched conditions.

Both implementations were tested using the same initial database state consisting of three seeded devices (IDs 1–3).

---

## Verified Finding 1 – Identifier Reuse After Deletion

Starting from a freshly seeded database, I deleted the highest numbered device and immediately created another.

| Implementation | Setup | Result |
|----------------|-------|--------|
| Hand-built | Deleted ID 3 | New device created with **ID 4** |
| AI-generated | Deleted ID 3 | New device created with **ID 4** |

Both implementations used `INTEGER PRIMARY KEY AUTOINCREMENT`, resulting in the same identifier behavior after deletion.

The prompt never required `AUTOINCREMENT`, so the AI independently chose the same strategy that I had already implemented during the migration.

---

## Verified Finding 2 – Malformed Identifier Handling

Neither the assignment nor my prompt specified how invalid route parameters should be handled.

Testing:

```
GET /devices/abc
```

produced different behavior.

| Implementation | Status | Response |
|----------------|--------|----------|
| Hand-built | **404** | Device not found |
| AI-generated | **400** | Invalid device id |

My implementation allows the request to reach the data layer, where no matching record is found.

The AI implementation introduced a reusable `parseDeviceId()` helper that validates route parameters before querying the database.

Both behaviors are reasonable depending on the API design goals. Returning **404** treats the request as referencing a resource that does not exist, while returning **400** treats the request itself as malformed because the identifier is not valid.

Since the prompt did not specify this case, the difference reflects an independent design decision rather than an implementation error. This became the clearest example in the project of two implementations satisfying the same stated contract while making different decisions about an unspecified edge case.

---

The two findings above were confirmed through direct runtime testing of both implementations under matched conditions. The code comparison below identifies the specific implementation choices responsible for each observed behavior.

---

## Code Comparison

I compared the implementations using:

```bash
git diff --no-index data/db.js ai-version/db.js

git diff --no-index data/devices.js ai-version/devices.js

git diff --no-index routes/devices.js ai-version/routes-devices.js
```

The comparison revealed several architectural differences despite both implementations producing the same external API behavior.

### AI implementation

The AI implementation introduced several improvements that were not explicitly required:

- Used `path.join(__dirname, "..", "devices.db")` for a platform-independent database path.
- Enabled SQLite foreign-key enforcement using `PRAGMA foreign_keys = ON`.
- Added `ORDER BY id` to guarantee deterministic query ordering.
- Added an `allowedFields` whitelist before generating update SQL.
- Dynamically generated `UPDATE` statements so only supplied fields were written.
- Centralized route parameter validation using a reusable helper function.

Worth noting that enabling foreign keys has no practical effect in this project because the schema contains only a single table without foreign-key relationships.

### My implementation

My implementation emphasized readability and explicitness.

It included:

- Clear documentation describing each architectural layer.
- Explicit SQL statements rather than dynamically generated SQL.
- Object-based seed data that is easier to inspect and modify.
- Initialization logging during first-time database creation.
- Straightforward CRUD operations that prioritize readability over abstraction.

---

## What the Prompt Left Unspecified

The prompt intentionally focused on API behavior rather than implementation details.

As a result, the AI independently decided:

- identifier strategy after deletion
- malformed-ID handling
- database path construction
- SQLite pragmas
- static versus dynamic SQL updates
- helper-function organization
- update-field whitelisting

These implementation choices became visible only after comparing the generated source code.

---

## Reflection

The most valuable outcome of this comparison was not confirming that an AI could generate working SQLite code.

Instead, it demonstrated where two independent implementations naturally converged and where they diverged when the specification intentionally left engineering decisions open.

Both implementations independently chose the same identifier strategy, providing evidence that `AUTOINCREMENT` was a reasonable default for this migration.

The malformed-ID behavior showed that even a detailed specification leaves legitimate implementation decisions open. Both implementations preserved the same REST API while making different choices for an unspecified edge case.

This exercise reinforced an important software engineering principle:

> A stable API contract allows the underlying implementation to evolve while preserving external behavior.

The comparison also showed that multiple implementations can satisfy the same requirements while making different trade-offs between readability, abstraction, maintainability, and scalability.