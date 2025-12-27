# Commit Message Guidelines

This project uses Husky and Commitlint to enforce Conventional Commits format for commit messages.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
Must be one of the following:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process, dependencies, or tools
- **ci**: Changes to CI configuration files and scripts
- **revert**: Reverts a previous commit

### Scope (Optional)
Specify what part of the codebase is affected. Examples:
- `auth`
- `users`
- `database`
- `config`
- `health`

### Subject
- Use imperative, present tense: "add" not "added" or "adds"
- Don't capitalize first letter
- No period (.) at the end
- Maximum 50 characters (recommended)

### Body (Optional)
- Wrap at 72 characters
- Explain what and why, not how
- Separate from subject with a blank line

### Footer (Optional)
- Reference issues with: `Closes #123`
- Breaking changes should start with `BREAKING CHANGE:`

## Examples

```
feat(auth): add JWT authentication strategy

Implement JWT-based authentication with passport.js integration.
Adds login and registration endpoints with password hashing.

Closes #45
```

```
fix(users): remove number conversion for MongoDB IDs

MongoDB IDs are strings, not numbers. Remove the unary plus
operator that was converting IDs to numbers in the controller.

Fixes #123
```

```
docs: update README with setup instructions
```

```
chore(deps): upgrade mongoose to v7.0.0
```

## Validation

Commit messages are automatically validated by Commitlint before commit.
If your message doesn't follow the format, the commit will be rejected.

To see validation in action, try committing with an invalid message.
