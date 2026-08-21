# Cheatsheet

Commands you will actually type, grouped by the question you are asking. This is not a reference manual. If you do not know *why* you need one of these, the exercise is the place to find out, not this page.

## Where am I?

```bash
git status
git branch -vv
git log --oneline --graph --decorate --all
git diff
git diff --staged
```

## Save work

```bash
git add <file>
git add -p                  # stage hunks, not whole files
git commit -m "type: why"
git commit --amend          # last commit, not pushed
```

## Move around

```bash
git switch <branch>
git switch -c <new-branch>
git switch -                # previous branch
git switch main && git pull
```

## Share

```bash
git fetch origin            # update remote-tracking branches, change nothing else
git pull                    # fetch + integrate
git push -u origin HEAD     # publish this branch
git remote -v
```

## Combine

```bash
git merge main              # join main into the branch you are on
git rebase origin/main      # replay this branch onto a newer main (unshared only)
git rebase -i HEAD~6        # edit local history before sharing
git cherry-pick <sha>       # copy one commit onto this branch
```

## Undo, in order of violence

```bash
git restore <file>          # throw away unstaged changes to a file
git restore --staged <file> # unstage, keep the change
git revert <sha>            # new commit that undoes a published one
git reset HEAD~1            # uncommit, keep the changes (unpushed)
git reset --hard origin/main
```

`reset --hard` is for *your* branch, matching a remote you trust. Not for `main`. Not for anyone else's work.

## Park something

```bash
git stash push -m "wip: reason"
git stash list
git stash pop
```

## Investigate

```bash
git show <sha>
git blame <file>
git log -p -- <file>
git reflog
git bisect start
```

## Clean up

```bash
git clean -n                # preview untracked files that would go
git clean -fd               # actually delete them
```

## Names for commits

```bash
git tag -a v0.2.0 -m "v0.2.0"
git push origin v0.2.0
```

## Branch names here

```text
feat/phoenix-dark-mode
fix/atlas-search
docs/striders-readme
test/nova-validation
refactor/forge-graph-layout
chore/helix-register
hotfix/ashes-production
```

`<type>/<team>-<description>`. Types: `feat` `fix` `docs` `test` `refactor` `chore` `hotfix`.

## Commit titles here

```text
feat: add participant filtering
fix: handle a missing GitHub avatar
docs: update setup instructions
test: cover collaboration score weights
revert: "refactor: simplify active developer metric"
```

A commit is a unit of history, not a save file.

## If you only remember four things

1. `git status` before and after almost everything
2. `git diff` / `git diff --staged` so you know what you are committing
3. `git fetch` is always safe
4. Published history is reverted. Local history can be reset.
