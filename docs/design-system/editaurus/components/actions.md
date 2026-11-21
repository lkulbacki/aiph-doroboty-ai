# Actions — stage 2C catalog pilot

Date: 2026-11-21. Implemented catalog extension; **human visual/API review pending**.
The existing [HeroButton acceptance](hero-action.md) is not widened by this pilot.
See [coverage](../coverage.md), [foundations](../foundations.md) and
[execution](../../../tasks/editaurus-stage-2c.md).

## Ownership and examples

The catalog at `/#/design-system/editaurus` imports existing production owners.
No primitive, wrapper API, global CSS, sizing token or domain controller changed.
Existing answer/consent/CV/feedback examples remain in place.

| Example                 | Shared owner / production context                                                                        | Behavior and scope                                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Primary navigation      | HeroLink in `src/components/editaurus/hero-button.tsx`; overview, home, employer jobs, offer actions     | Native React Router Link with buttonVariants; opens real offers route. Catalog uses default green, not home's blue/pink palette exception |
| Submitted action        | Existing disabled HeroButton/check icon                                                                  | Green completed state; never treated as permission to submit again                                                                        |
| Unavailable publication | Existing HeroButton plus `.editaurus-job-editor` contextual disabled override from employer editor       | Gray disabled with associated reason; no fake approval or publication controller                                                          |
| Dangerous action        | Existing SecondaryButton plus `.editaurus-danger-button`; settings/reset, withdrawal and rejecting stage | Catalog handler changes local preview feedback only. It has no access to reset/run/domain mutation and is explicitly labeled a preview    |
| Quiet navigation        | Existing Link + `.editorial-offer-text-link` recipe from offers/companies                                | Real navigation to offers, not a button or fake domain action                                                                             |
| Context return          | Existing BackLink in record context                                                                      | Shared arrow/text anatomy; real offers destination. Context classes retain route-specific CSS rather than creating a new owner            |

A generic quiet action button, loading action, or arbitrary new variant is not
invented to fill a catalog cell. The record tabs' `Button variant="ghost"` remains
a Tabs composition with tab semantics, not a generic action button example.
A destructive preview does not demonstrate the real confirmation/pending/error
flow; those contracts remain in ConfirmDialog and domain consumers.

## Link/button preflight

The current [shadcn Base Button guidance](https://ui.shadcn.com/docs/components/base/button)
(rechecked 2026-11-21) recommends native anchors styled with buttonVariants for
navigation. It warns about Button-render anchor semantics. This guidance is a
comparison point, not permission to rewrite all installed-version consumers.

Current HeroLink already uses native Link + buttonVariants. Current Base UI 1.8.0
Button defaults `nativeButton=true`; inspected installed useButton chooses native
versus role-button props accordingly. In the browser, overview **Edytuj profil**
and profile **Podgląd profilu**, rendered through SecondaryButton's render API,
were anchors with href and no explicit role. Space did not navigate the overview
link; Enter opened the profile. No demonstrated defect justifies replacing those
owners in this slice. Do not add `nativeButton={false}` to these links merely to
follow an assumed general rule: re-evaluate DOM/keyboard behavior first.

| Consumer group                                          | Source preflight                                                     | Current execution evidence / retained boundary                                                                                          |
| ------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Home, overview, employer new job, public offer          | HeroLink navigation / HeroButton operation                           | Native catalog link tested with Enter, Space and middle click; home palette remains separate; unchanged real flows covered by full gate |
| Role gate, overview, profile/preview, saved empty state | SecondaryButton render Link in workspace                             | Overview/profile DOM and keyboard observed manually; no global adapter change                                                           |
| Employer listing/company                                | SecondaryButton render Link in employer                              | Source checked; no independent manual exhaustive role/route audit claimed                                                               |
| Candidate form/profile, employer editor                 | Primary/secondary form operations                                    | Existing validation/draft/publish gates retained; no controllers moved into catalog                                                     |
| Settings, withdrawal, stage decisions                   | Secondary dangerous recipe and controlled confirmation/inline action | Preview never invokes domain handlers; existing full browser journeys remain regression evidence                                        |
| Records, dialog close, shell mobile menu                | Tabs/Dialog render Button, native menu button                        | Keep render composition; not equivalent to navigation Link                                                                              |
| CV                                                      | Existing native PDF open/download links and preview composition      | Existing CV catalog/real consumer tests retained; no new asset or download API                                                          |
| BackLink and quiet links                                | Native Link recipes with contextual CSS                              | Native catalog context link exercised; no product route or copied URL change                                                            |

No upstream source was copied or replaced. No exact registry revision was needed
for importing existing production owners. A future upstream replacement/API delta
still requires the pinned Base UI-branch source and explicit local diff required
by the foundation report. base-nova configuration alone is not conformance proof.

## Validation and acceptance

The focused regression checks native link semantics, Enter/Space, unintercepted modified events, middle-click
new-tab navigation, disabled reasons, submitted versus unavailable appearance,
long labels inside their cards at 1280/390/320px, visible forced-color focus,
effectively instant reduced-motion transitions and an unchanged serialized
scenario after preview interactions and navigation. Source and real behavior
checks remain distinct from human visual acceptance.

Reduced motion uses the global `workspace.css` rule with important 0.01ms durations;
a computed sample was `1e-05s`, not exact 0s. The local editaurus transition-none
rule does not override that important duration. This is documented, not changed.
No loading promise or asynchronous pending state was added to the synchronous
application flow. No missing salary, saved job, recovery or snapshot behavior was
removed to simplify the examples.

Review the new action examples and existing real consumers before accepting any
portable rules. Next proposed family is 2D fields/consent/CV/feedback reconciliation;
stop here until the user authorizes it. The external skill remains a later stage.
