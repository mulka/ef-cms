import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionsSummary = connect(
  {
    recentTrialSessions:
      state.formattedDashboardTrialSessions.formattedSessions,
    upcomingTrialSessions:
      state.formattedDashboardTrialSessions.formattedSessions,
    user: state.user,
  },
  ({ recentTrialSessions, upcomingTrialSessions, user }) => {
    return (
      <React.Fragment>
        <table
          aria-label="trial sessions"
          className="usa-table ustc-table trial-sessions subsection"
          id="sessions-summary"
        >
          <thead>
            <tr>
              <th colSpan="3">Upcoming Trial Sessions</th>
              <th>
                <a
                  className="usa-button usa-button--unstyled"
                  href={`/trial-sessions?judge=${user.userId}`}
                >
                  View All
                </a>
              </th>
            </tr>
          </thead>
          {upcomingTrialSessions.map((trialDate, idxDate) => (
            <React.Fragment key={idxDate}>
              <tbody>
                <tr className="trial-date">
                  <td colSpan="3">{trialDate.formattedStartDate}</td>
                  <td colSpan="3">{trialDate.trialLocation}</td>
                </tr>
              </tbody>
            </React.Fragment>
          ))}
          <thead>
            <tr>
              <th colSpan="3">Recent Trial Sessions</th>
              <th>
                <button className="usa-button--unstyled">View All</button>
              </th>
            </tr>
          </thead>
          {recentTrialSessions.map((trialDate, idxDate) => (
            <React.Fragment key={idxDate}>
              <tbody>
                <tr className="trial-date">
                  <td colSpan="3">{trialDate.formattedStartDate}</td>
                  <td colSpan="3">{trialDate.trialLocation}</td>
                </tr>
              </tbody>
            </React.Fragment>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
