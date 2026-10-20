Most claims about AI and productivity come from controlled studies of particular tasks in particular firms. They are useful, but they cannot say whether a method helps with a given person's own work. This self-test can: it compares the same recurring tasks with and without a method over two weeks, using a spreadsheet and about two minutes of record-keeping per task.

## Set up

1. **Choose two or three tasks that recur** at least five times a week, such as answering a type of enquiry, summarising meeting papers, checking a monthly spreadsheet or drafting a standard letter. Tasks that take between ten minutes and two hours work best.
2. **Choose one method** for each task from the [Productivity Protocols](/productivity/), or keep an existing way of using AI and test that instead.
3. **Decide what "accepted" means** for each task before starting: sent, signed off, merged or filed without further change.
4. **Download the [record sheet](/assets/productivity/self-test-record.csv)** and open it in any spreadsheet program.

## Run it for two weeks

Alternate days or alternate items: one with the method, the next without, so that busy and quiet days fall on both sides. Aim for at least ten items of each kind for each task.

For every item, record one row:

| Column | What to enter |
|---|---|
| `date` | The day the item was done |
| `task` | A short label, the same each time, for example *enquiry reply* |
| `condition` | `with` or `without` the method |
| `active_minutes` | Time spent working on the item, including reading and correcting the AI's output |
| `rework_minutes` | Time spent later fixing the item after it was first accepted |
| `accepted_first_time` | `yes` if it was accepted without being sent back, otherwise `no` |
| `quality_1_to_5` | A quick rating, ideally by someone who did not know which condition was used |
| `errors_found_later` | The number of errors found after acceptance |
| `notes` | Anything unusual, such as an interruption or an unusually hard item |

Record every item, including the ones that went badly. Leaving out failures is the commonest way a self-test overstates a gain.

## Read the result

For each task, compare the two conditions on four numbers:

- the **median** active minutes, with and without, which is less affected by one unusual item than the average;
- the share **accepted first time**;
- the total **rework** minutes;
- the median **quality** rating.

A method is worth keeping for a task if it saves time without raising rework or lowering quality. If the time saved is smaller than the day-to-day variation in either condition, treat the result as no clear difference, not as a gain.

Two weeks with one person is a small sample. The result applies to that person, those tasks and those tools at that time. It is not a general finding about the method, and it is not a controlled experiment, because the person always knows which condition they are using.

## The results ledger

Evidence Press keeps an open, anonymised ledger of self-test results so that a picture of where AI helps, and where it does not, can build up from real work. Submissions are made through a public [GitHub form](https://github.com/ipitchford/evidence-press-site/issues/new?template=productivity-result.yml). They should contain only summary figures, never the work itself or anything that identifies a person, client or organisation. Every complete submission is recorded, whatever it shows.

The ledger is published at [/assets/productivity/results.json](/assets/productivity/results.json). It is currently empty: the first results will appear as they are submitted. Each entry is labelled as a self-reported, uncontrolled result.

[Back to Productivity Protocols](/productivity/)
