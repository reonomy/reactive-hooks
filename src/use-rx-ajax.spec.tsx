import React from 'react';
import { mount } from 'enzyme';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { act } from 'react-testing-library';
import { useRxAjax } from './use-rx-ajax';

interface IFoo {
  api$: (foo: string) => Observable<string>;
}

function Foo({ api$ }: IFoo) {
  const [response, dispatch] = useRxAjax(api$);
  return (
    <>
      <button type="button" id="btn" onClick={() => dispatch('foo')} />
      <div id="status">{(response && response.status) || 'None'}</div>
      <div id="res">{(response && JSON.stringify(response.res)) || 'None'}</div>
      <div id="error">{(response && response.error) || 'None'}</div>
    </>
  );
}

describe('useRxAjax()', () => {
  it('should execute api call when button is clicked and handle successful response', () => {
    const ajaxSubject$ = new Subject<string>();
    const api$ = () => ajaxSubject$;

    const fooComp = mount(<Foo api$={api$} />);
    const status = fooComp.find('#status');
    expect(status.text()).toContain('None');

    // Button click should trigger request.
    fooComp.find('#btn').simulate('click');
    expect(status.text()).toContain('pending');

    // Fulfill response.
    act(() => ajaxSubject$.next('foo'));
    expect(status.text()).toContain('succeeded');
    expect(fooComp.find('#res').text()).toContain('foo');
  });

  it('should execute api call when button is clicked and handle failure xhr error', () => {
    const ajaxSubject$ = new Subject<string>();
    const api$ = () => ajaxSubject$;

    const fooComp = mount(<Foo api$={api$} />);
    const status = fooComp.find('#status');
    expect(status.text()).toContain('None');

    // Button click should trigger request.
    fooComp.find('#btn').simulate('click');
    expect(status.text()).toContain('pending');

    act(() => ajaxSubject$.error({ xhr: { response: 'oops!' } }));

    expect(status.text()).toContain('failed');
    expect(fooComp.find('#error').text()).toContain('oops!');
  });
});
