import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VideoPlayer } from '../VideoPlayer';

// Mock lucide-react icons to simplify rendering
vi.mock('lucide-react', () => ({
  Play: () => <span data-testid="icon-play" />,
  Pause: () => <span data-testid="icon-pause" />,
  Volume2: () => <span data-testid="icon-volume" />,
  VolumeX: () => <span data-testid="icon-volume-x" />,
}));

const testSrc = 'https://example.com/video.mp4';
const testPoster = 'https://example.com/poster.jpg';

describe('VideoPlayer – accessibility', () => {
  it('renders a <track> element for captions inside the video', () => {
    const { container } = render(<VideoPlayer src={testSrc} />);
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();

    const track = video!.querySelector('track');
    expect(track).toBeInTheDocument();
    expect(track).toHaveAttribute('kind', 'captions');
    expect(track).toHaveAttribute('label', 'Captions');
  });

  it('renders play/pause button with accessible aria-label when controls is enabled', () => {
    render(<VideoPlayer src={testSrc} controls />);
    expect(screen.getByRole('button', { name: /play video/i })).toBeInTheDocument();
  });

  it('renders mute/unmute button with accessible aria-label when controls is enabled', () => {
    render(<VideoPlayer src={testSrc} controls muted />);
    expect(screen.getByRole('button', { name: /unmute video/i })).toBeInTheDocument();
  });

  it('does not render control buttons when controls is false', () => {
    render(<VideoPlayer src={testSrc} controls={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('uses native video element with proper preload attribute', () => {
    const { container } = render(<VideoPlayer src={testSrc} />);
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('preload', 'metadata');
    expect(video).toHaveAttribute('playsInline', '');
  });

  it('renders muted video by default (checking HTMLMediaElement.muted property)', () => {
    const { container } = render(<VideoPlayer src={testSrc} />);
    const video = container.querySelector('video') as HTMLVideoElement;
    // In jsdom the .muted property reflects the component state more reliably
    // than the HTML muted attribute
    expect(video.muted).toBe(true);
  });

  it('renders poster image when poster prop is provided', () => {
    const { container } = render(<VideoPlayer src={testSrc} poster={testPoster} />);
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('poster', testPoster);
  });

  it('renders nothing when video errors (null return — no orphaned UI)', async () => {
    const onError = vi.fn();
    const { container } = render(<VideoPlayer src={testSrc} onError={onError} />);
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();

    // Fire error using testing-library's fireEvent for reliable React synthetic event handling
    fireEvent.error(video!);

    // Wait for React to process the state update and re-render
    await waitFor(() => {
      expect(container.innerHTML).toBe('');
    });

    expect(onError).toHaveBeenCalledTimes(1);
  });
});
