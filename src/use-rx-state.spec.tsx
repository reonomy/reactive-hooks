import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-testing-library';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { useRxState } from './use-rx-state';

interface IFoo {
  foo$: Observable<string>;
}

function Foo({ foo$ }: IFoo) {
  const [foo] = useRxState(foo$);
  return <div>{foo || 'None'}</div>;
}

interface IBar {
  bar$: Subject<string>;
}

function Bar({ bar$ }: IBar) {
  const [bar, setBar] = useRxState(bar$);
  return (
    <button type="button" id="btn" onClick={() => setBar('bar')}>
      {bar || 'None'}
    </button>
  );
}

describe('useRxState()', () => {
  describe('when foo$ is a Behavior Subject', () => {
    let foo$: BehaviorSubject<string>;

    afterEach(() => {
      if (foo$) {
        foo$.complete();
      }
    });

    it('should print the current value', () => {
      foo$ = new BehaviorSubject('foo');

      const fooComp = mount(<Foo foo$={foo$} />);
      expect(fooComp.text()).toContain('foo');
    });

    it('should render changes', () => {
      foo$ = new BehaviorSubject('foo');
      act(() => foo$.next('bar'));

      const fooComp = mount(<Foo foo$={foo$} />);
      expect(fooComp.text()).toContain('bar');

      act(() => foo$.next('alice'));
      expect(fooComp.text()).toContain('alice');

      act(() => foo$.next('bob'));
      expect(fooComp.text()).toContain('bob');
    });

    it('should be able to mutate a given subject', () => {
      const bar$ = new BehaviorSubject('foo');

      const barComp = mount(<Bar bar$={bar$} />);
      expect(barComp.text()).toContain('foo');

      // When clicks on the button, the component resets state to `bar`.
      barComp.find('#btn').simulate('click');
      expect(barComp.text()).toContain('bar');
      expect(bar$.value).toBe('bar');
    });
  });

  describe('when foo$ is a Subject', () => {
    let foo$: Subject<string>;

    afterEach(() => {
      if (foo$) {
        foo$.complete();
      }
    });

    it('should render changes', () => {
      foo$ = new Subject();
      act(() => foo$.next('foo'));

      const fooComp = mount(<Foo foo$={foo$} />);

      // Subject has no current value.
      expect(fooComp.text()).toContain('None');

      act(() => foo$.next('alice'));
      expect(fooComp.text()).toContain('alice');

      act(() => foo$.next('bob'));
      expect(fooComp.text()).toContain('bob');
    });

    it('should be able to mutate a given subject', () => {
      const fooBar$ = new Subject<string>();

      const barComp = mount(<Bar bar$={fooBar$} />);
      expect(barComp.text()).toContain('None');

      const fooComp = mount(<Foo foo$={fooBar$} />);
      expect(fooComp.text()).toContain('None');

      // When clicks on the button, the component1 resets state to `bar`.
      barComp.find('#btn').simulate('click');
      expect(barComp.text()).toContain('bar');

      // And component2 should be changed as well.
      expect(fooComp.text()).toContain('bar');
    });
  });

  describe('when foo$ is an Observable', () => {
    let foo$: Observable<string>;

    it('should render changes', () => {
      const bar$ = new BehaviorSubject('bar');
      foo$ = bar$.asObservable();
      const fooComp = mount(<Foo foo$={foo$} />);
      expect(fooComp.text()).toContain('bar');

      act(() => bar$.next('alice'));
      expect(fooComp.text()).toContain('alice');

      act(() => bar$.next('bob'));
      expect(fooComp.text()).toContain('bob');
    });
  });
});
