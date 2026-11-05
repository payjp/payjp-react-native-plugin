import { expect, it } from '@jest/globals';
import * as React from 'react';
import renderer, { act } from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

it(`renders correctly`, async () => {
    let root: renderer.ReactTestRenderer;
    await act(async () => {
        root = renderer.create(<ThemedText>Snapshot test!</ThemedText>);
    });

    expect(root!.toJSON()).toMatchSnapshot();
});
