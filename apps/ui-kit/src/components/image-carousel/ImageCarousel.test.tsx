import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageCarousel } from './ImageCarousel';

// jsdom does not implement scrollTo; stub it to prevent errors
beforeAll(() => {
  window.HTMLElement.prototype.scrollTo = () => {};
});

const images = [
  { src: 'https://picsum.photos/id/10/600/400', alt: 'Mountain' },
  { src: 'https://picsum.photos/id/20/600/400', alt: 'Forest' },
  { src: 'https://picsum.photos/id/30/600/400', alt: 'Ocean' },
];

function setup(overrides = {}) {
  const user = userEvent.setup();
  const result = render(
    <ImageCarousel images={images} {...overrides}>
      <ImageCarousel.Prev />
      <ImageCarousel.Viewport />
      <ImageCarousel.Next />
      <ImageCarousel.Dots />
    </ImageCarousel>,
  );
  return { user, ...result };
}

describe('ImageCarousel', () => {
  it('renders with region role and carousel roledescription', () => {
    setup();
    const region = screen.getByRole('region', { name: 'Image Carousel' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('renders all images', () => {
    setup();
    expect(screen.getAllByRole('group')).toHaveLength(3);
  });

  it('renders prev and next buttons', () => {
    setup();
    expect(screen.getByRole('button', { name: '이전 이미지' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음 이미지' })).toBeInTheDocument();
  });

  it('renders dots as tabs', () => {
    setup();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('first dot is selected initially', () => {
    setup();
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('clicking next button updates active dot', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: '다음 이미지' }));
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('clicking prev button updates active dot', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: '다음 이미지' }));
    await user.click(screen.getByRole('button', { name: '이전 이미지' }));
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('clicking a dot navigates to that slide', async () => {
    const { user } = setup();
    const tabs = screen.getAllByRole('tab');
    await user.click(tabs[2]!);
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('loop=true: prev from first goes to last', async () => {
    const { user } = setup({ loop: true });
    await user.click(screen.getByRole('button', { name: '이전 이미지' }));
    const tabs = screen.getAllByRole('tab');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('loop=false: prev button disabled at first slide', () => {
    setup({ loop: false });
    expect(screen.getByRole('button', { name: '이전 이미지' })).toBeDisabled();
  });

  it('loop=false: next button disabled at last slide', async () => {
    const { user } = setup({ loop: false });
    await user.click(screen.getByRole('button', { name: '다음 이미지' }));
    await user.click(screen.getByRole('button', { name: '다음 이미지' }));
    expect(screen.getByRole('button', { name: '다음 이미지' })).toBeDisabled();
  });

  it('keyboard: ArrowRight advances slide', async () => {
    const { user } = setup();
    const region = screen.getByRole('region', { name: 'Image Carousel' });
    region.focus();
    await user.keyboard('{ArrowRight}');
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('keyboard: ArrowLeft goes to previous slide', async () => {
    const { user } = setup();
    const region = screen.getByRole('region', { name: 'Image Carousel' });
    region.focus();
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowLeft}');
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('keyboard: Home goes to first slide', async () => {
    const { user } = setup();
    const region = screen.getByRole('region', { name: 'Image Carousel' });
    region.focus();
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{Home}');
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('keyboard: End goes to last slide', async () => {
    const { user } = setup();
    const region = screen.getByRole('region', { name: 'Image Carousel' });
    region.focus();
    await user.keyboard('{End}');
    const tabs = screen.getAllByRole('tab');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('first image has loading=eager, others have loading=lazy', () => {
    setup();
    const imgs = screen.getAllByRole('img');
    expect(imgs[0]).toHaveAttribute('loading', 'eager');
    expect(imgs[1]).toHaveAttribute('loading', 'lazy');
    expect(imgs[2]).toHaveAttribute('loading', 'lazy');
  });

  it('each slide has correct aria-label', () => {
    setup();
    const groups = screen.getAllByRole('group');
    expect(groups[0]).toHaveAttribute('aria-label', '1 of 3');
    expect(groups[1]).toHaveAttribute('aria-label', '2 of 3');
    expect(groups[2]).toHaveAttribute('aria-label', '3 of 3');
  });

  it('images have alt text', () => {
    setup();
    expect(screen.getByAltText('Mountain')).toBeInTheDocument();
    expect(screen.getByAltText('Forest')).toBeInTheDocument();
    expect(screen.getByAltText('Ocean')).toBeInTheDocument();
  });
});
