import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Test suite for Novartis Bioinformatis Code challenge APP', () => {

  test('renders the app and check the presence of the', () => {
    const { container } = render(<App />)
    const filterGene = screen.getAllByText(/gene symbol/i)
    expect(filterGene[0]).toBeInTheDocument()
    const lineage = screen.getAllByText(/lineage/i)
    expect(lineage[0]).toBeInTheDocument()

    expect(container).toMatchSnapshot()
  });
})