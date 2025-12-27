module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',      // A new feature
                'fix',       // A bug fix
                'docs',      // Documentation only changes
                'style',     // Changes that do not affect the meaning of the code (white-space, formatting, etc)
                'refactor',  // A code change that neither fixes a bug nor adds a feature
                'perf',      // A code change that improves performance
                'test',      // Adding missing tests or correcting existing tests
                'chore',     // Changes to the build process, dependencies, or tools
                'ci',        // Changes to CI configuration files and scripts
                'revert',    // Reverts a previous commit
            ],
        ],
        'type-case': [2, 'always', 'lowercase'],
        'type-empty': [2, 'never'],
        'scope-case': [2, 'always', 'lowercase'],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
        'header-max-length': [2, 'always', 100],
    },
};
