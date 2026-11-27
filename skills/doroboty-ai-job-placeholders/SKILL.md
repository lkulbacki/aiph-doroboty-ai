---
name: doroboty-ai-job-placeholders
description: Generate fictional, paste-ready Polish job offers about working with AI for the DoRoboty.ai prototype. Use for sample offers, placeholders, or demo job listings, with a random Lead / Build / Apply category unless the user specifies a category or names a job role.
---

# DoRoboty.ai job placeholders

1. Read [the new-offer form contract](references/new-offer-form.md). Generate one offer by default or the requested number. Use the user's requested industry, role, and working conditions wherever they fit the form.
2. Honor an explicit Lead, Build, or Apply category. If the user names a job without specifying a category, choose the best fit for its main responsibility. Otherwise make an independent, equally weighted random draw for each unspecified offer. Draw before writing the title or responsibilities. For each draw, run `node -e 'console.log(["Lead", "Build", "Apply"][require("node:crypto").randomInt(3)])'` or use an available random-number generator. Repeats in a batch are valid.
3. Use supplied briefs, datasets, or example offers to derive the type of work, workflow, collaboration, and success criteria. If no material is supplied, use the example scenarios in the form contract. Invent the project, conditions, and copy. Keep names, contacts, and claims fictional. Vary sectors, job functions, and AI workflows across a batch. The bundled contract and examples suffice outside the repository.
4. Write in Polish and return each offer as a separate block with the form labels in order. Mark it as a fictional offer outside the copyable field values. Include a source brief for the hiring team, a candidate-facing summary, and a practical description covering the project, responsibilities, requirements, and how the team reviews AI-assisted work. Add the optional project question and both salary bounds by default unless the user asks to omit them. Ask about the candidate's own contribution and result in a comparable project. Keep all fields consistent with the category, function, level, location, and employment terms.
5. Validate the field values against the contract before returning the offer. Treat generation as preparation for a human to review and paste. Leave prototype state and publication approval to the employer.
