import React from 'react';
import { mount } from 'enzyme';
import useMountEffect from './use-mount-effect';

interface IFoo {
  foo: string;
  onMount: VoidFunction;
}

function Foo({ foo, onMount }: IFoo) {
  useMountEffect(onMount);
  return (<div>{foo}</div>);
}

describe('useMountEffect()', () => {
  it('should trigger a given callback only once when component is mounted', () => {
    const onMountCallback = jest.fn();
    const foo = mount(<Foo foo="foo" onMount={onMountCallback} />);
    expect(foo.text()).toContain('foo');

    foo.setProps({ foo: 'bar' });
    expect(foo.text()).toContain('bar');

    expect(onMountCallback).toHaveBeenCalledTimes(1);
  });

  it('should call unmount callback', () => {
    const unMountCallback = jest.fn();
    const onMountCallback = () => {
      return unMountCallback;
    };
    const foo = mount(<Foo foo="foo" onMount={onMountCallback} />);
    foo.unmount();

    expect(unMountCallback).toHaveBeenCalledTimes(1);
  });
});
