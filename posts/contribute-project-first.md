---
title: 'My First Open Source Contribution: Lessons From the Blockchain Module'
date: '2025-09-26'
excerpt: "A beginner's first open source contribution and the lessons learned from fixing real mistakes."
tags: ['open source', 'learning', 'Python']
---

# My First Open Source Contribution: Lessons From the Blockchain Module

For a long time, I wanted to contribute to open source but always thought: *“I know nothing, I’ll just break things.”*
Today, I finally did it — and I want to record every step, including the mistakes I made, how I fixed them, and what I learned.

---

## Step 1: Picking a Project

I forked the [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) repository.
It’s a large project, but it has clear contribution rules:

* Return results (no `print` statements)
* Add **type hints**
* Write **doctests or tests**
* Document **time/space complexity**

That gave me a roadmap. I decided to focus on the **`blockchain/diophantine_equation.py`** file and add a helper function.

---

## Step 2: Writing the Function

I implemented `all_diophantine_solutions(a, b, c, n=2)`.
This function returns up to `n` integer solutions to a linear Diophantine equation.

My first draft looked fine, but then the real learning began…

---

## Step 3: My Mistakes (and Fixes)

### ❌ Mistake 1 — Wrong Import Placement

I added:

```python
from __future__ import annotations
```

in the **middle** of the file.
Result:

```
SyntaxError: from __future__ imports must occur at the beginning of the file
```

✅ Fix: Either move it to the very top or remove it. I removed it, since Python 3.9+ already supports modern type hints.

---

### ❌ Mistake 2 — Function Below `__main__`

I put my function **after**:

```python
if __name__ == "__main__":
    from doctest import testmod
    ...
```

That broke the style rules.
✅ Fix: Always place new functions **above** the `__main__` block.

---

### ❌ Mistake 3 — Line Too Long

One docstring line exceeded 88 characters.
✅ Fix: Wrap long lines so the linter (ruff) is happy.

---

### ❌ Mistake 4 — f-String in Exception

I wrote:

```python
raise ValueError(f"No integer solutions exist for a={a}, b={b}, c={c}")
```

Lint error:

```
EM102 Exception must not use an f-string literal, assign to variable first
```

✅ Fix:

```python
msg = f"No integer solutions exist for a={a}, b={b}, c={c}"
raise ValueError(msg)
```

---

### ❌ Mistake 5 — Running Doctests

When I tried:

```bash
python3 -m doctest -v blockchain/diophantine_equation.py
```

I got:

```
ModuleNotFoundError: No module named 'maths'
```

✅ Fix: Run doctests from the **project root** so relative imports resolve correctly:

```bash
cd ~/contri_pt/Python
python3 -m doctest -v blockchain/diophantine_equation.py
```

---

## Step 4: Passing the Checks

After fixing everything, I ran:

```bash
python3 -m doctest -v blockchain/diophantine_equation.py
pre-commit run --all-files --show-diff-on-failure
ruff check
```

And finally — **all tests passed** ✅.

---

## Step 5: Committing and Pushing

From the project root:

```bash
git add blockchain/diophantine_equation.py
git commit -m "feat(blockchain): add all_diophantine_solutions with type hints & doctests"
git push -u origin feat/blockchain-diophantine-return-list
```

Then I opened a **pull request** to the upstream repo.

---

## Lessons Learned

1. **Start small.** One helper function is enough for a first contribution.
2. **Linters are your teachers.** Every error message told me exactly what to fix.
3. **Read the rules carefully.** TheAlgorithms project enforces strict style, and I had to adapt.
4. **Don’t panic at errors.** Most of my time was spent fixing mistakes — and that’s normal.

---

## Final Thoughts

My first open-source contribution wasn’t smooth — I made syntax mistakes, style mistakes, and even ran commands in the wrong directory. But that’s the point: every error was part of the learning.

Now, I have my first PR ready for review. It feels amazing. 🚀

If you’re a beginner: fork a project, pick a small function, add tests, and let the tools guide you. Open source is not about being perfect — it’s about learning in public.
