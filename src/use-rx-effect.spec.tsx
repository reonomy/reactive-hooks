import React, { useState } from 'react';
import { mount } from 'enzyme';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { act } from '@testing-library/react';
import { useRxEffect } from './use-rx-effect';

interface IFoo {
  foo$: Observable<string>;
}

function Foo({ foo$ }: IFoo) {
  const [res, setRes] = useState('None');
  useRxEffect(foo$, foo => {
    setRes(foo.toUpperCase());
  });
  return <div>{res}</div>;
}

describe('useRxEffect()', () => {
  it('should react on changes', () => {
    const foo$ = new BehaviorSubject('foo');

    const fooComp = mount(<Foo foo$={foo$} />);
    expect(fooComp.text()).toContain('FOO');

    act(() => foo$.next('bar'));
    expect(fooComp.text()).toContain('BAR');

    act(() => foo$.next('foo-bar'));
    expect(fooComp.text()).toContain('FOO-BAR');
  });
});
