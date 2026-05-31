# FAS-Framework: A Build-Time Configured Feature-Agent-Spec Framework

FAS-Framework is a modern, production-ready TypeScript backend application framework built explicitly to enforce the **Feature-Agent-Spec (FAS)** design philosophy. 

Traditional architectures are prone to "AI code drift" and hidden coupling during collaborative human-AI development. This framework solves those problems by enforcing strict module boundaries, compile-time feature gating, and database isolation.

---

## 1. Feature-Agent-Spec (FAS) Architectural Alignment

FAS-Framework implements the FAS specification via the following key design patterns:

### A. Strict Sandboxing & Zero Cross-Talk
All feature-specific business logic, database migrations, and static frontend assets are kept entirely inside isolated directories under `/features/`. 
- **No Core Dependency Leaks:** The `core/` modules are strictly stateless and agnostic of which features exist. Core never statically imports any feature code.
- **No Inter-Feature Imports:** Features are prohibited from importing directly from other features. If `features/A` needs to communicate with `features/B`, it must publish events via the global decoupled `EventBus` exposed in `FeatureContext`.

### B. Compile-Time Feature Gating (Zero Remnants)
Rather than loading features dynamically at runtime, this framework resolves active features at **build time**.
- **Dynamic Registry Manifest:** Before compilation, a script (`scripts/build_prep.js`) reads `config.json` and writes `core/registry_manifest.ts` containing static imports *only* for the active features.
- **Tree-Shaking:** Disabled features are omitted from the compilation graph, guaranteeing they leave zero footprints in the compiled production bundle.
- **Compiler Safety Gate:** If any core file or active feature contains lingering imports to a disabled/deleted feature, the compiler (`tsc`) will fail immediately.

### C. Stateless Bridge Adapter (Database Isolation)
The Core manages the PostgreSQL connection pool and exposes a query bridge (`db.query`) to features.
- Features register their database schemas via the `db.registerMigration` hook during the `onBoot` lifecycle.
- When a feature is deleted or disabled, its migration registration code is never compiled, ensuring the runtime schema manager runs only active tables with zero remnants.

---

## 2. Public Repositories (The FAS Ecosystem)

This project is part of the FAS architectural demonstration ecosystem. Link references:
*   **FAS Specification:** [ljack/feature-agent-spec](https://github.com/ljack/feature-agent-spec) (The foundational design rules).
*   **Core Framework Engine:** [ljack/fas-framework](https://github.com/ljack/fas-framework) (This repository).
*   **Sudoku Example Application:** [ljack/fas-sudoku-app](https://github.com/ljack/fas-sudoku-app) (Stateless Sudoku game built as a decoupled feature).

---

## 3. CLI Feature Commands

Manage feature states and lifecycles dynamically from your terminal:

- **Create a feature template:**
  ```bash
  npm run feature:scaffold <name>
  ```
- **Enable a feature:**
  ```bash
  npm run feature:enable <name>
  ```
- **Disable a feature (removes from build):**
  ```bash
  npm run feature:disable <name>
  ```
- **Delete a feature folder and config entries (0 remnants):**
  ```bash
  npm run feature:delete <name>
  ```

---

## 4. Run the Application

Launch the stateless application and the database services together:

```bash
docker compose up --build
```
The application will boot the Express server on port `3000`.
