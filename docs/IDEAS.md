# Ideas

These are product ideas that are not implementation decisions yet.

## Recognition Cost Modes

Idea: gardenin could have different recognition behavior by plan.

- Free mode: prioritize taking more user photos and using the user's own repository before making external AI/API calls.
- Pro mode: allow more frequent AI/API calls for faster recognition and fewer retry steps.
- Possible wording: `Free learns your garden over time. Pro identifies faster with more AI calls.`

Open questions:

- How many external ID calls should be included in free mode?
- Should Pro mean `always call AI`, or just `call AI sooner`?
- Can user-owned repository recognition reduce costs enough that free mode still feels good?
- How should we avoid making free users feel punished for helping train recognition?
