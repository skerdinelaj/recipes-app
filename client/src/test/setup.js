// Runs before every test file.
import '@testing-library/jest-dom/vitest'; // adds matchers like toBeInTheDocument()
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();             // unmount whatever the test rendered
  localStorage.clear();  // don't leak a logged-in user into the next test
});
