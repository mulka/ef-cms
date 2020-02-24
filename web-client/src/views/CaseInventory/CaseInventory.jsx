import { BigHeader } from '../BigHeader';
import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseInventory = connect(
  {
    caseInventoryHelper: state.caseInventoryHelper,
  },
  ({ caseInventoryHelper }) => {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <div className="title">
            <h1>Case Inventory</h1>

            <Button
              link
              className="float-right"
              icon="print"
              onClick={() => null}
            >
              Printable Report
            </Button>
          </div>

          <div className="grid-row grid-gap padding-top-3 padding-bottom-1">
            <div className="grid-col-2 padding-top-05">
              <h3 id="filterHeading">Filter by</h3>
            </div>
            <div className="grid-col-3">
              <BindedSelect
                ariaDescribedBy="case-deadlines-tab filterHeading"
                ariaLabel="judge"
                bind="screenMetadata.caseDeadlinesFilter.judge"
                className="select-left"
                id="judgeFilter"
                name="judge"
                placeHolder="- Judge -"
              >
                <option value="">-Judge-</option>
                {caseInventoryHelper.judges.map((judge, idx) => (
                  <option key={idx} value={judge}>
                    {judge}
                  </option>
                ))}
              </BindedSelect>
            </div>
            <div className="grid-col-3">
              <BindedSelect
                ariaDescribedBy="case-deadlines-tab filterHeading"
                ariaLabel="judge"
                bind="screenMetadata.caseDeadlinesFilter.judge"
                className="select-left"
                id="judgeFilter"
                name="judge"
                placeHolder="- Judge -"
              >
                <option value="">-Status-</option>
                {Object.keys(caseInventoryHelper.caseStatuses).map(key => {
                  const value = caseInventoryHelper.caseStatuses[key];
                  return (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  );
                })}
              </BindedSelect>
            </div>
          </div>

          <div className="grid-row grid-gap margin-top-1">
            <div className="grid-col-12 text-align-right">
              Count: {caseInventoryHelper.resultCount}
            </div>
          </div>

          <div className="grid-row grid-gap margin-top-1">
            <div className="grid-col-12">
              <table className="usa-table row-border-only subsection work-queue deadlines">
                <thead>
                  <tr>
                    <th>Docket</th>
                    <th>Case title</th>
                    <th>Judge</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </section>
      </>
    );
  },
);
