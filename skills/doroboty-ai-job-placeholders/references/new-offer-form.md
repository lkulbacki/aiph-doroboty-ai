# DoRoboty.ai new-offer form

The employer reaches `/#/app/oferty/nowa` through **Moje oferty → Dodaj ofertę**. This snapshot captures the rendered prototype editor verified on 2026-11-22. The source of the form is `src/features/prototype/employer.tsx`. The underlying validation and labels are in `src/features/prototype/model.ts` and `src/features/jobs/presentation.ts`.

| Form label                                 | Value                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| Nazwa stanowiska                           | Required, 1–200 characters after trimming.                                        |
| Brief — kogo szukasz i do jakiego zadania? | Optional in the form, up to 12,000 characters. Include it in a complete offer.    |
| Krótkie podsumowanie                       | Required for publication, 10–12,000 characters.                                   |
| Opis oferty                                | Required for publication, 30–12,000 characters. Markdown headings and lists work. |
| Pytanie o wkład w projekt (opcjonalnie)    | Optional, up to 12,000 characters.                                                |
| Kategoria                                  | Build, Apply, Lead.                                                               |
| Funkcja                                    | Product, Engineering, Data, Design, Marketing, Operations.                        |
| Tryb pracy                                 | Stacjonarnie, Hybrydowo, Zdalnie.                                                 |
| Poziom                                     | Junior, Mid, Senior, Lead.                                                        |
| Umowa                                      | Umowa o pracę, B2B, Umowa zlecenie.                                               |
| Lokalizacja                                | Required free text, 1–200 characters. Use a real city for an office-based role.   |
| Wynagrodzenie od (PLN brutto / mies.)      | Optional, nonnegative whole number for pasting.                                   |
| Wynagrodzenie do (PLN brutto / mies.)      | Optional, nonnegative whole number, at least the lower bound when both are given. |

Use confirmed values from each of the five required dropdowns. The new-offer editor fixes the salary basis at PLN gross per month for all contract types. The active employer persona supplies the company. Publication requires the employer's approval checkbox. The form also has actions that generate a description proposal or optional question suggestions. Paste-ready copy can be entered directly in the corresponding fields.

## Category examples

Use the main responsibility to distinguish the categories. Function and seniority are separate fields. For example, a Senior in Product can be in the Lead category, and a Lead in Engineering can be in Build. These scenarios abstract patterns from the prototype's synthetic `src/features/prototype/data/marketplace.json` listings.

- **Lead** owns direction, adoption, or decisions. Examples include a product manager deciding where an AI document assistant should enter a workflow, or an operations lead running a phased rollout with human escalation and adoption measures.
- **Build** builds or maintains an AI capability. Examples include an engineer implementing retrieval and evaluation for a knowledge assistant, or a data scientist monitoring an inventory forecast and investigating drift.
- **Apply** uses AI within another professional discipline. Examples include an operations specialist reviewing AI-suggested support replies, or a designer using AI to explore and test ways to explain uncertainty to users.
