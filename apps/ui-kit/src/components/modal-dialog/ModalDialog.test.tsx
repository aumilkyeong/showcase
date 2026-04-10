import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalDialog } from './ModalDialog';

function ControlledModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose}>
      <ModalDialog.Header>Test Title</ModalDialog.Header>
      <ModalDialog.Body>Test body content</ModalDialog.Body>
      <ModalDialog.Footer>
        <button onClick={onClose}>Close</button>
        <button>Confirm</button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

function UncontrolledModal() {
  return (
    <ModalDialog defaultOpen={false}>
      <ModalDialog.Trigger>
        <button>Open Modal</button>
      </ModalDialog.Trigger>
      <ModalDialog.Header>Uncontrolled Title</ModalDialog.Header>
      <ModalDialog.Body>Uncontrolled body</ModalDialog.Body>
      <ModalDialog.Footer>
        <button>OK</button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

describe('ModalDialog', () => {
  it('renders nothing when isOpen is false', () => {
    render(<ControlledModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when isOpen is true', () => {
    render(<ControlledModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test body content')).toBeInTheDocument();
  });

  it('renders in document.body via portal', () => {
    const { baseElement } = render(
      <div id="app-root">
        <ControlledModal isOpen={true} onClose={vi.fn()} />
      </div>,
    );
    const dialog = screen.getByRole('dialog');
    expect(baseElement.contains(dialog)).toBe(true);
  });

  it('has correct ARIA attributes', () => {
    render(<ControlledModal isOpen={true} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('clicking overlay calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ControlledModal isOpen={true} onClose={onClose} />);
    // The wrapper div (parent of dialog) handles overlay clicks
    const dialog = screen.getByRole('dialog');
    const wrapper = dialog.parentElement!;
    await user.click(wrapper);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking inside modal does not call onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ControlledModal isOpen={true} onClose={onClose} />);
    await user.click(screen.getByText('Test body content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closeOnOverlayClick=false prevents overlay close', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ModalDialog isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
        <ModalDialog.Body>Content</ModalDialog.Body>
      </ModalDialog>,
    );
    const dialog = screen.getByRole('dialog');
    const wrapper = dialog.parentElement!;
    await user.click(wrapper);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ESC key calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ControlledModal isOpen={true} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Header close button calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ControlledModal isOpen={true} onClose={onClose} />);
    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('showCloseButton=false hides close button in header', () => {
    render(
      <ModalDialog isOpen={true} onClose={vi.fn()}>
        <ModalDialog.Header showCloseButton={false}>Title</ModalDialog.Header>
        <ModalDialog.Body>Content</ModalDialog.Body>
      </ModalDialog>,
    );
    expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument();
  });

  it('focus trap: Tab cycles within modal', async () => {
    const user = userEvent.setup();
    render(<ControlledModal isOpen={true} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(document.activeElement).not.toBe(document.body);
    });
    const dialog = screen.getByRole('dialog');
    for (let i = 0; i < 10; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('focus trap: Shift+Tab cycles backward within modal', async () => {
    const user = userEvent.setup();
    render(<ControlledModal isOpen={true} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(document.activeElement).not.toBe(document.body);
    });
    const dialog = screen.getByRole('dialog');
    for (let i = 0; i < 10; i++) {
      await user.tab({ shift: true });
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('scroll lock: body overflow is hidden when open', () => {
    render(<ControlledModal isOpen={true} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('uncontrolled: Trigger opens modal', async () => {
    const user = userEvent.setup();
    render(<UncontrolledModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open Modal' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled Title')).toBeInTheDocument();
  });
});
