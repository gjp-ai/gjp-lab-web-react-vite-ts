/** @jest-environment jsdom */
import { afterEach, expect, jest, test } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

afterEach(cleanup);

test('owned Button keeps native disabled behavior and invokes enabled actions', () => {
  const action = jest.fn();
  const { rerender } = render(
    <Button type="button" onClick={action}>
      Save
    </Button>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(action).toHaveBeenCalledTimes(1);
  rerender(
    <Button type="button" variant="outline" size="sm" disabled onClick={action}>
      Save
    </Button>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(action).toHaveBeenCalledTimes(1);
});

test('Card composition retains headings, content, actions, and footer controls', () => {
  const action = jest.fn();
  render(
    <Card size="sm" aria-label="Preferences">
      <CardHeader>
        <CardTitle>
          <h2>Preferences</h2>
        </CardTitle>
        <CardDescription>Choose your settings.</CardDescription>
        <CardAction>
          <Button type="button" onClick={action}>
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>Saved locally.</CardContent>
      <CardFooter>
        <Button type="button">Cancel</Button>
      </CardFooter>
    </Card>,
  );
  expect(screen.getByRole('heading', { name: 'Preferences' })).toBeTruthy();
  expect(screen.getByText('Saved locally.')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
  expect(action).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
});

test('conditional classes omit false entries and caller utilities replace conflicting defaults', () => {
  expect(cn('px-2 text-sm', false, undefined, { hidden: false, block: true }, 'px-4')).toBe(
    'text-sm block px-4',
  );
});
