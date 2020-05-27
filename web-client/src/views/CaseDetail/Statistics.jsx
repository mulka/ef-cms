import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Statistics = connect(
  {
    caseDetail: state.caseDetail,
    statisticsHelper: state.statisticsHelper,
  },
  function Statistics({ caseDetail, statisticsHelper }) {
    return (
      <>
        {statisticsHelper.showAddButtons && (
          <div className="grid-row grid-gap flex-justify-end margin-bottom-2">
            {statisticsHelper.showAddDeficiencyStatisticsButton && (
              <Button
                link
                className="push-right padding-0"
                href={`/case-detail/${caseDetail.docketNumber}/add-deficiency-statistics`}
                icon="plus-circle"
              >
                Add New Year/Period
              </Button>
            )}
            {statisticsHelper.showAddOtherStatisticsButton && (
              <Button
                link
                className="push-right padding-0"
                href={`/case-detail/${caseDetail.docketNumber}/add-other-statistics`}
                icon="plus-circle"
              >
                Add Other Statistics
              </Button>
            )}
          </div>
        )}
        {statisticsHelper.showNoStatistics && (
          <p>There are no statistics for this case.</p>
        )}
        {statisticsHelper.formattedStatistics && (
          <div className="grid-row grid-gap flex-justify">
            <div className="grid-col-6">
              <h4>
                Deficiency
                {statisticsHelper.showEditButtons && (
                  <Button link className="padding-0 margin-left-2" icon="edit">
                    Edit
                  </Button>
                )}
              </h4>
              <table className="usa-table docket-record responsive-table row-border-only">
                <thead>
                  <tr>
                    <th>Year/Period</th>
                    <th>IRS Notice</th>
                    <th>Determination</th>
                  </tr>
                </thead>
                <tbody>
                  {statisticsHelper.formattedStatistics.map(
                    (statistic, index) => (
                      <tr key={index}>
                        <td>{statistic.formattedDate}</td>
                        <td>{statistic.formattedIrsDeficiencyAmount}</td>
                        <td>
                          {statistic.formattedDeterminationDeficiencyAmount}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid-col-6">
              <h4>Penalties</h4>
              <table className="usa-table docket-record responsive-table row-border-only">
                <thead>
                  <tr>
                    <th>IRS Notice</th>
                    <th>Determination</th>
                  </tr>
                </thead>
                <tbody>
                  {statisticsHelper.formattedStatistics.map(
                    (statistic, index) => (
                      <tr key={index}>
                        <td>{statistic.formattedIrsTotalPenalties}</td>
                        <td>
                          {statistic.formattedDeterminationTotalPenalties}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {statisticsHelper.showOtherStatistics && (
          <div className="grid-row grid-gap flex-justify">
            <div className="grid-col-6">
              <h4>
                Other
                {statisticsHelper.showEditButtons && (
                  <Button link className="padding-0 margin-left-2" icon="edit">
                    Edit
                  </Button>
                )}
              </h4>
              <table className="usa-table docket-record responsive-table row-border-only">
                <thead>
                  <tr>
                    <th>Litigation costs</th>
                    <th>Damages (IRC §6673)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{statisticsHelper.formattedLitigationCosts}</td>
                    <td>{statisticsHelper.formattedDamages}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  },
);
