# Glossary

Words the workshop uses with a specific meaning. Everyday English is often close and not close enough.

**Working directory** — the files on disk. What your editor shows you.

**Staging area (index)** — the draft of the next commit. `git add` copies a change here. `git commit` records whatever is here, not whatever is in the working directory.

**Commit** — a snapshot, with a parent, an author, a message, and a hash. A unit of history. Not a save file.

**Hash / SHA** — the id of a commit (or a tree, or a blob). `9f3a1c2` is enough to name one in a small repo.

**Branch** — a pointer to a commit. Creating one copies nothing. Committing while you are on it moves the pointer forward.

**`HEAD`** — a pointer to the branch you are currently on (or, when detached, to a commit directly). Git moves `HEAD`'s target when you commit.

**Detached HEAD** — `HEAD` points at a commit, not a branch. New commits have no branch name. Easy to lose. See [recovery.md](recovery.md).

**Fast-forward** — a merge where the branch you are merging into has not moved, so Git just slides the pointer forward. No merge commit.

**Merge commit** — a commit with two parents, joining two histories.

**Merge conflict** — Git will not guess which of two human changes to keep. Not a failure. A refusal.

**Remote** — another copy of the repository, usually on GitHub. `origin` is the conventional name for the one you cloned from.

**Remote-tracking branch** — `origin/main` is your *local record* of where `main` was on the remote the last time you fetched. It is not the server.

**Fetch** — update remote-tracking branches. Change no files of yours.

**Pull** — fetch, then integrate into the branch you are on.

**Push** — publish local commits to a remote.

**Tracking branch** — a local branch configured to push/pull against a specific remote branch. `git push -u origin HEAD` sets this up.

**Upstream (open source)** — the original project. Your fork is `origin`. The original is `upstream`.

**Fork** — a copy of a repository, on GitHub, under your account, that remembers where it came from.

**Clone** — a copy of a repository, on your laptop, with history and remotes.

**Issue** — a problem, a request, or a piece of work. No diff attached. Can be open for months.

**Pull request** — a proposed change, with a diff, from one branch into another. The inspection request.

**Review** — a human looking at a pull request and choosing Approve, Request changes, or Comment.

**CODEOWNERS** — a file that names who must review changes to a path. Combined with branch protection, it is automatic review routing.

**CI (continuous integration)** — automated checks that run on every pull request. Lint, test, build, and whatever else the repo has decided is a gate.

**CD** — continuous *delivery* (every change on main is releasable) or continuous *deployment* (every change on main is released). Not synonyms.

**Required check** — a CI job that must be green before merge. Configured in the branch ruleset.

**Advisory check** — a CI job that can be red without blocking merge. Still visible. Still useful.

**Branch protection / ruleset** — the rules that make `main` reject direct pushes, require reviews, and require checks.

**Revert** — a new commit that applies the inverse of an old one. The way to undo published history.

**Reset** — move a branch pointer. `--hard` also throws away the working tree. For local, unshared history.

**Reflog** — the local log of where `HEAD` has been. How you find commits that no branch names any more.

**Rebase** — replay commits on top of a new starting point. Rewrites hashes. Do not do it to commits other people have.

**Cherry-pick** — copy one commit onto the current branch by replaying its diff.

**Bisect** — binary search over history to find the commit that introduced a bug.

**Blame** — annotate each line of a file with the last commit that touched it. Archaeology, not accusation.

**Stash** — park uncommitted work on a stack so you can switch context.

**Tag** — a name for a commit, usually a version. Annotated tags also store a message and a date.

**Release** — a GitHub object built from a tag: notes, assets, a page people can look at.

**Main** — the branch everyone else is standing on. The building. Not a place you construct in.

**Force-push** — tell the remote to throw away its copy of a branch and take yours. `--force-with-lease` refuses if the remote has moved since you last looked.

**`.gitignore`** — files Git should pretend do not exist. Untracked only. A file that is already tracked stays tracked until `git rm --cached`.
