# <img src="https://github.com/reonomy/reactive-hooks/raw/master/assets/logo.png" height="200px"/>

# Reactive Hooks Library For React

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/reonomy/reactive-hooks/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/@reonomy/reactive-hooks.svg?style=flat-square)](https://www.npmjs.com/package/@reonomy/reactive-hooks) 

```bash
$ yarn add @reonomy/reactive-hooks
```
Reactive Hooks is a library for rendering [RxJS](https://rxjs-dev.firebaseapp.com/) Observables using [React Hooks](https://reactjs.org/docs/hooks-reference.html#usestate).

# API Reference

## useRxState
Returns a current value and a function to update it.

```typescript
[foo, setFoo] = useRxState(foo$);
```

Example:
```typescript
import React from 'react';
import { useRxState } from '@reonomy/reactive-hooks';
import { Observable } from 'rxjs';

interface IFoo {
  foo$: Observable<string>;
}

function Foo({ foo$ }: IFoo) {
  const [foo, setFoo] = useRxState(foo$);
  return (
    <button onClick={() => setFoo('bar')}>
        {foo}
    </button>
  );
}
```

During the initial render, the returned state `foo` is the same as the current value passed as the first argument `foo$`.
The button click handler will update `foo$` and set this state to `bar`.

## useRxStateResult
Returns a current state of a given observable.

```typescript
foo = useRxStateResult(foo$);
```

Example:
```typescript
import React from 'react';
import { useRxState } from '@reonomy/reactive-hooks';
import { Observable } from 'rxjs';

interface IFoo {
  foo$: Observable<string>;
}

function FooReader({ foo$ }: IFoo) {
  const foo = useRxStateResult(foo$);
  return (
    <p>
        {foo}
    </p>
  );
}
```

## useRxEffect
Invokes a callback function when a given observable emits a new state.

```typescript
useRxEffect(foo$, didUpdate);
```

Example:
```typescript
import React from 'react';
import { useRxState } from '@reonomy/reactive-hooks';
import { Observable } from 'rxjs';

interface IFoo {
  foo$: Observable<string>;
}

function FooReader({ foo$ }: IFoo) {
  useRxEffect(foo$, (foo) => {
      console.log('new foo is ', foo);
  });
  return <p>Foo<p>;
}
```

## useRxAjax = useRxState + useRxEffect

Returns an ajax response and a function to submit a request. In addition it invokes a callback function on state updates (e.g. when status is changed from `pending` to `succeeded`/`failed`).

```typescript
[response, submitRequest] = useRxAjax(ajaxFoo, didUpdate);
```

The callback function is useful when a side effect should be invoked.

## useRxDebounce
Invokes a callback function with a given debounce timeout when a given observable emites a new state.

```typescript
[response, submitRequest] = useRxDebounce(useRxDebounce, didUpdate, timeout);
```

## useMountEffect
Invokes a callback function when a component is mounted and rendered for the very first time.

```typescript
useMountEffect(didMount);
```

# Author
[Dmitry Doronin](https://www.linkedin.com/in/ddoronin)

# References

1. [The Road to React: Building the Reactive Hooks Library](https://www.reonomy.com/blog/post/reactive-hooks)

# License
MIT

