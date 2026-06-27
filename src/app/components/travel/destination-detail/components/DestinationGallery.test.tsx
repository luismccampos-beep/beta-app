import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DestinationGallery } from './DestinationGallery';

// Mock next/image as a plain <img> element, preserving onError to test error handling
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, sizes, unoptimized, ...rest } = props;
    return <img {...rest} alt={(rest.alt as string) ?? ''} />;
  },
}));

const sampleImages = [
  'https://example.com/photo1.jpg',
  'https://example.com/photo2.jpg',
  'https://example.com/photo3.jpg',
];

describe('DestinationGallery', () => {
  it('returns null when images is an empty array', () => {
    const { container } = render(
      <DestinationGallery images={[]} title="Galeria" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders gallery thumbnails when images are provided', () => {
    const { container } = render(
      <DestinationGallery images={sampleImages} title="Galeria" />,
    );
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBe(3);
  });

  it('renders the gallery title', () => {
    render(
      <DestinationGallery images={[sampleImages[0]]} title="Fotos do Porto" />,
    );
    expect(screen.getByText('Fotos do Porto')).toBeInTheDocument();
  });

  it('renders correct alt text on thumbnails', () => {
    render(
      <DestinationGallery images={[sampleImages[0]]} title="Galeria" />,
    );
    const img = screen.getByAltText('Galeria 1');
    expect(img).toBeInTheDocument();
  });

  it('opens lightbox when a thumbnail is clicked', () => {
    render(
      <DestinationGallery images={sampleImages} title="Galeria" />,
    );
    const thumbButton = screen.getByLabelText('Galeria 1 of 3');
    fireEvent.click(thumbButton);
    // Lightbox shows the image counter
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('navigates to next image in lightbox', () => {
    render(
      <DestinationGallery images={sampleImages} title="Galeria" />,
    );
    fireEvent.click(screen.getByLabelText('Galeria 1 of 3'));
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    const nextBtn = screen.getByLabelText('Next image');
    fireEvent.click(nextBtn);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('closes lightbox when close button is clicked', () => {
    render(
      <DestinationGallery images={sampleImages} title="Galeria" />,
    );
    fireEvent.click(screen.getByLabelText('Galeria 1 of 3'));
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Close gallery');
    fireEvent.click(closeBtn);
    expect(screen.queryByText('1 / 3')).not.toBeInTheDocument();
  });

  it('handles image error by tracking failed image (no crash)', () => {
    render(
      <DestinationGallery images={[sampleImages[0]]} title="Galeria" />,
    );
    // Trigger error on the first image
    const img = screen.getByAltText('Galeria 1');
    fireEvent.error(img);
    // Component should not crash - just verifies the render didn't throw
    expect(screen.getByText('Galeria')).toBeInTheDocument();
  });
});
