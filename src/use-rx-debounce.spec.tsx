import React from 'react';
import { mount } from 'enzyme';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { act } from 'react-testing-library';
import { useRxDebounce, DEBOUNCE } from './use-rx-debounce';

interface IFoo {
  api$: (foo: string) => Observable<string>;
}

function Foo({ api$ }: IFoo) {
  const [result, dispatch] = useRxDebounce(api$);
  return (
    <>
      <input id="text-box" onChange={e => dispatch(e.target.value)} />
      <div id="result">{(result && JSON.stringify(result)) || 'None'}</div>
    </>
  );
}

describe('useRxDebounce()', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should debounce input changes', () => {
    // const nextSpy = spyOn(subject$, 'next');
    const api$ = (foo: string) => of(foo);

    const fooComp = mount(<Foo api$={api$} />);
    const tb = fooComp.find('#text-box');
    tb.simulate('change', { target: { value: 'f' } });
    tb.simulate('change', { target: { value: 'fo' } });
    tb.simulate('change', { target: { value: 'foo' } });

    const result = fooComp.find('#result');
    act(() => jest.advanceTimersByTime(DEBOUNCE - 1));
    expect(result.text()).toContain('None');

    act(() => jest.advanceTimersByTime(1));
    expect(result.text()).toContain('foo');
  });
});
