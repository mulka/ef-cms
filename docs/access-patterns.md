# DynamoDB Access Patterns

The following table is meant to help understand the different ways we use dynamodb to store our application's data.  

| Access Scenario                                            | PK                                              | SK                                       | GS1PK                                       |
|------------------------------------------------------------|-------------------------------------------------|------------------------------------------|---------------------------------------------|
| the case deadline object                                   | case-deadline\|${DEADLINE_ID}                   | case-deadline\|${DEADLINE_ID}            |                                             |
| associate a deadline with a case (mapping record)          | case\|${CASE_ID}                                | case-deadline\|${DEADLINE_ID}            |                                             |
| a case                                                     | case\|${CASE_ID}                                | case\|${CASE_ID}                         |                                             |
| associate an irs practitioner onto a case                  | case\|${CASE_ID}                                | irsPractitioner\|${USER_ID}              |                                             |
| associate a private practitioner onto a case               | case\|${CASE_ID}                                | privatePractitioner\|${USER_ID}          |                                             |
| associate docket entry on a case                           | case\|${CASE_ID}                                | docket-entry\|${DOCKET_ENTRY_ID}         |                                             |
| add correspondence to a case                               | case\|${CASE_ID}                                | correspondence\|${CORRESPONDENCE_ID}     |                                             |
| associate message onto a case                              | case\|${CASE_ID}                                | message\|${MESSAGE_ID}                   | message\|${MESSAGE_ID}                      |
| add a hearing to a case                                    | case\|${CASE_ID}                                | hearing\|${TRIAL_SESSION_ID}             |                                             |
| a work item on a case                                      | case\|${CASE_ID}                                | work-item\|${WORK_ITEM_ID}               |                                             |
| docket number generator counter                            | docketNumberCounter-${YEAR}                     | docketNumberCounter-${YEAR}              |                                             |
| how we store the list of trial sessions eligble for a case | eligible-for-trial-case-catalog                 | LasVegasNevada-H-B-20190816132910-107-19 | eligible-for-trial-case-catalog\|${CASE_ID} |
| associate practitioner by bar number for lookup            | privatePractitioner\|${BAR_NUMBER}              | user\|${userId}                          |                                             |
| associate practitioner by name for lookup                  | privatePractitioner\|${NAME}                    | user\|${userId}                          |                                             |
| save outbox workitems for a section sorted by date         | section-outbox\|                                | $datetime                                | work-item\|${WORK_ITEM_ID}                  |
| for getting all users in a section                         | section\|${SECTION_NAME}                        | user\|${USER_ID}                         |                                             |
| work item saved in a section                               | section\|${SECTION_NAME}                        | work-item\|${WORK_ITEM_ID}               | work-item\|${WORK_ITEM_ID}                  |
| copy the trial session and attach it to the user           | trial-session-working-copy\|${TRIAL_SESSION_ID} | user\|${USER_ID}                         |                                             |
| a trial session record                                     | trial-session\|${TRIAL_SESSION_ID}              | trial-session\|${TRIAL_SESSION_ID}       | trial-session-catalog                       |
| add a case note to the user                                | user-case-note\|${USER}                         | user\|${USER_ID}                         |                                             |
| lookup a user by their email                               | user-email\|${EMAIL}                            | user\|${USER_ID}                         |                                             |
| user outbox workitems sorted by date                       | user-outbox\|${USER_ID}                         | $datetime                                | work-item\|${WORK_ITEM_ID}                  |
| associate user with a case                                 | user\|${USER_ID}                                | case\|${CASE_ID}                         | user-case\|${CASE_ID}                       |
| associate user with pending case                           | user\|${USER_ID}                                | pending-case\|${CASE_ID}                 |                                             |
| save web socket connection associated with the user        | user\|${USER_ID}                                | connection\|${SOCKET_ID}                 | connection\|${SOCKET_ID}                    |
| create a user                                              | user\|${USER_ID}                                | user\|${USER_ID}                         |                                             |
| save work items for a user inbox                           | user\|${USER_ID}                                | work-item\|${WORK_ITEM_ID}               | work-item\|${WORK_ITEM_ID}                  |
| a work item entry                                          | work-item\|${WORK_ITEM_ID}                      | work-item\|${WORK_ITEM_ID}               | work-item\|${WORK_ITEM_ID}                  |
