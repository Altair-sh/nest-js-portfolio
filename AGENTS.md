# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

A NestJS GraphQL API that serves the author's resume, made as a test task for
an HR manager. They open Apollo Sandbox on the deployed app and query the
profile. **The code must stay simple and human-readable** — prefer the plain
solution over a clever one.

**Read [README.md](README.md) first.** It has the technology stack and the
install, run, test and Railway deployment steps, which are not repeated here.

Source files:

- `src/profile/` for the GraphQL models, resolver and service
- `src/prisma/` for `PrismaService`, the database client
- `src/logger/` for `CompactLogger`, the app's logger
- `src/generated/` for the generated Prisma client
- `prisma/` for the database schema, migrations and seed script
- `test/` for end to end tests

## Architecture

The GraphQL schema is **generated from code**: the decorated classes in
[src/profile/profile.models.ts](src/profile/profile.models.ts) are the schema.
There is no hand-written `.graphql` file.

[src/profile/profile.service.ts](src/profile/profile.service.ts) loads the
single profile with all its lists through Prisma's `include`, and converts
database dates into the GraphQL `Date` type with `DateModel.fromDate`.

The resume data lives only in [prisma/seed.ts](prisma/seed.ts). The seed
deletes the profile and creates it again, so editing that file and rerunning
the seed is how the resume is updated. Tests mock `PrismaService` and do not
depend on the seed.

## Development environment

The developer machine may run **Windows, Linux or macOS**. Find out which one
at the start of a session, before running any command — from the session's
environment info, or with `uname` / `$env:OS` — and write commands for that
shell. Do not write PowerShell for Linux, or POSIX shell syntax for Windows
`cmd`.

## Answering the user

**Keep replies short.** Answer the question or say what was changed in a few
lines. Do not retell the code you wrote, list every file you touched, explain
alternatives you did not take, or offer extra work nobody asked for. Give more
detail only when the user asks for it.

## Tools and files

**Prefer the editor's own tools over shell commands that do the same thing.**
Reading, editing, writing and searching files have dedicated tools; reaching
for `cat`, `sed`, `grep` or a throwaway script instead does the same work while
spending more tokens, and every command may need its own approval. Use the shell
for what only the shell can do — running the build, the linter, git, a real
program.

**Work inside the project directory.** For temporary files — scratch scripts,
intermediate output, test data — create a `TEMP/` directory in the project root
and keep everything there, then delete that directory once the work is done.
Ask before reading or writing anything outside the project directory.

## Long-running scripts

**Do not write scripts that never finish or run for many minutes.** This
applies to tests, benchmarks and temporary scripts alike. Check for loops
without an exit condition, and also for code that finishes only in theory, such
as reading a 100 GB file byte by byte or waiting a second between steps.

- **Parallelize slow work** like computation or network requests, using as many
  threads as the current machine has cores (`os.availableParallelism()` in
  Node).
- **Report progress** in anything that runs longer than a few seconds, at least
  a line like `` console.log(`fetched ${n} of 1000 files`) ``. A script that is
  silent for too long looks broken, and the user will stop it.
- **Ask before running it** when a script will take long and there is no easy
  way to make it faster. Say roughly how long it will take, and wait for an
  explicit yes.

## Terminal

**On Windows, prefer `bash.exe`** — but only a real MSYS2, Cygwin, or
MinGW/Git Bash installation, for example `D:\msys2\usr\bin\bash.exe`.

**Never use `C:\Windows\System32\bash.exe`.** Despite its name it is not a
POSIX bash; it is the launcher stub for WSL. Do not start WSL to run ordinary
commands.

If no MSYS/Cygwin/MinGW bash is installed, **use PowerShell** as the terminal.
PowerShell is the fallback, never WSL.

If bash reports `command not found` for `node` or `npm`, that is a `PATH`
problem rather than a missing install: MSYS2 defaults `MSYS2_PATH_TYPE` to
`minimal`, which discards the Windows `PATH`. Setting it to `inherit` fixes it.

## Commands

```sh
npm run start:dev  # dev server with reload on file change
npm run build      # prisma generate + nest build
npm run lint       # oxlint
npm run format     # prettier, rewrites everything except .gitignore/.prettierignore
npx tsc --noEmit   # typecheck
npm run db:migrate # create and apply a migration (prisma migrate dev)
npm run db:seed    # erase the database and refill it from prisma/seed.ts
npm run test       # unit tests (src/**/*.spec.ts)
npm run test:e2e   # end to end tests (test/*.e2e-spec.ts)
```

### Checking your work

**Always run `npm run lint` and `npx tsc --noEmit` after changing code.** Both
must finish with no errors and no warnings. Also run `npm run build` when the
Prisma schema or the build config changed.

Do not report a change as finished until these commands pass.

### Tests

**Never run a test suite or a benchmark without explicit permission.** Ask
first and wait for a clear yes, however easy the command looks. Lint and build
are the exception, and are expected after every change.


## Version control

This project is managed with **git**.

**Read-only git commands are fine to use without asking.**
`git status`, `git log`, `git diff`, `git show`, `git blame` and similar inspection commands
may be run freely.

**Never run a git command that changes the repository without the user's
explicit permission.**
This is a strict ban, and it covers everything that writes to the history, the index,
or the working tree including `add`, `commit`, `checkout`, `restore`, `reset`,
`stash`, `branch`, `merge`, `rebase`, `push`, `rm`, etc.

Ask first and wait for a clear yes before running such git command.

## Conventions

Prettier settings live in `.prettierrc` and are not negotiable: **4 spaces, no
semicolons, single quotes, 80 column width**. Run `npm run format` after
editing, or match the surrounding style exactly.

The project is ESM. Imports are relative and end in `.js`, for example
`import { PrismaService } from '../prisma/prisma.service.js'`.

**Do only what was asked.** Do not refactor, rename or "improve" code
outside the task.

**Comment the code you write.** This codebase is read by human programmers who
did not write it. Keep comments simple and preferably single line, placed above
the code they describe, and write them in plain language. Say _why_ the code
does what it does — what is non-obvious, what would break if it were written
the obvious way — and leave out what the code already states plainly.

## Dependencies

**Search for an existing library before writing your own implementation.**
Formats, protocols and codecs are full of details that only show up against
real data, and a maintained library has already met them.

**Read the library's source before adding it, and judge it on that.** Download
counts say nothing about quality. Even a popular package may turn out to be a
single ten thousand line file whose variables and functions are all named `a`,
`b` and `c`, with no comments anywhere. Such code cannot be read, cannot be
maintained, and is very likely to be carrying bugs nobody can find — do not
depend on it. Look for readable sources, comments that explain intent, and an
API that fits the way the code here is written.

If nothing of good quality exists, say so and propose writing an implementation
here instead, rather than pulling in the least bad option.

Do not add a second library for a job a package already in `package.json` can
do.

## Things that will bite you

**Prisma 7 does not read `.env` automatically.** Both [src/main.ts](src/main.ts) and
[prisma.config.ts](prisma.config.ts) load it with `process.loadEnvFile`, which
does not override variables that are already set. The Docker container ignores
`.env`; its variables come from `docker-compose.yml` or Railway.

**The Prisma client is generated and gitignored.** It lives in `src/generated/`
and must never be edited by hand. After a fresh clone or a change to
`prisma/schema.prisma`, run `npx prisma generate` — in Prisma 7 `migrate dev`
no longer does it. A schema change goes like this:

```sh
npm run db:migrate -- --name <what_changed>
npx prisma generate
```

**Dates are stored as `@db.Date` and come back as midnight UTC.** Read them
with UTC getters (`getUTCFullYear`, `getUTCMonth`, `getUTCDate`), as
`DateModel.fromDate` does. Local time getters shift the day in time zones west
of UTC.

**The container migrates and seeds on every start.** The Dockerfile `CMD` runs
`prisma migrate deploy` and `prisma db seed` before the app, so the seed must
stay safe to run again. Railway builds the Dockerfile as it is and ignores
`docker-compose.yml`.

**The Dockerfile has no separate build stage on purpose.** Migrate and seed
must run after the database is connected (by docker compose or Railway) and
before the app starts, so the Prisma CLI has to be installed in the final
image's `node_modules` and stays in `dependencies`. The Prisma CLI cannot be
minified, so a separate build stage that bundles the app would not make the
image noticeably smaller. It would only make the Dockerfile harder to read.
