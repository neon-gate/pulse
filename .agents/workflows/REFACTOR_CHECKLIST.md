# Refactor Checklist (Example)

## When To Use

Before merging large PRs or improving legacy sections.

---

## Code Quality

* Types are explicit
* No `any`
* No duplicated logic
* DRY respected
* Clear naming

---

## Architecture

* Server/Client boundaries respected
* Hooks not misused
* Logic separated from UI

---

## Performance

* Unnecessary re-renders removed
* Memoization applied when needed
* No heavy computations in render

---

## Cleanliness

* Console logs removed
* Dead code removed
* Proper folder placement

---

## Final Rule

If the refactor does not improve:

* Clarity
* Performance
* Scalability

It should not be merged.
