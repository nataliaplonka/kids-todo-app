import React from 'react';
import { render } from '@testing-library/react-native';
import TaskItem from '../src/components/TaskItem';

describe('TaskItem', () => {
  it('renders title and points', () => {
    const task = { title: 'Test', points: 5 };
    const { getByText } = render(<TaskItem task={task} onDelete={() => {}} />);
    expect(getByText('Test')).toBeTruthy();
    expect(getByText('5 pts')).toBeTruthy();
  });
});
