import { getTrialCityName } from './formattedTrialCity';
import { runCompute } from 'cerebral/test';
import { trialCitiesHelper } from './trialCitiesHelper';

describe('trialCitiesHelper', () => {
  it('returns trialCitiesByState which is an object of state => city pairs', async () => {
    const result = await runCompute(trialCitiesHelper, {
      state: {
        constants: {
          TRIAL_CITIES: {
            SMALL: [
              {
                city: 'Chattanooga',
                state: 'Tennessee',
              },
            ],
          },
        },
        getTrialCityName,
      },
    });
    const trialCities = result('Small');
    expect(trialCities).toMatchObject({
      trialCitiesByState: { Tennessee: ['Chattanooga, Tennessee'] },
    });
  });

  it('returns regular trialCitiesByState by default if param is not "small"', async () => {
    const result = await runCompute(trialCitiesHelper, {
      state: {
        constants: {
          TRIAL_CITIES: {
            REGULAR: [
              {
                city: 'Chicago',
                state: 'Illinois',
              },
            ],
          },
        },
        getTrialCityName,
      },
    });
    const trialCities = result('not small');
    expect(trialCities).toMatchObject({
      trialCities: { Illinois: ['Chicago, Illinois'] },
    });
  });
});
