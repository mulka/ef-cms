import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { toggleMenuStateAction } from './toggleMenuStateAction';

describe('toggleMenuStateAction', () => {
  it('sets the value of the given props.menuState to false if it is currently true', async () => {
    const result = await runAction(toggleMenuStateAction, {
      modules: {
        presenter,
      },
      props: {
        menuState: 'foo',
      },
      state: {
        foo: true,
      },
    });

    expect(result.state.foo).toEqual(false);
  });

  it('sets the value of the given props.menuState to true if it is currently false', async () => {
    const result = await runAction(toggleMenuStateAction, {
      modules: {
        presenter,
      },
      props: {
        menuState: 'foo',
      },
      state: {
        foo: false,
      },
    });

    expect(result.state.foo).toEqual(true);
  });

  it('sets the value of the given props.menuState to true if it is currently falsy', async () => {
    const result = await runAction(toggleMenuStateAction, {
      modules: {
        presenter,
      },
      props: {
        menuState: 'foo',
      },
      state: {
        foo: undefined,
      },
    });

    expect(result.state.foo).toEqual(true);
  });
});
