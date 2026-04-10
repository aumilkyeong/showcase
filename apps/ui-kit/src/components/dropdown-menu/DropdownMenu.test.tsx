import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownMenu } from './DropdownMenu';

function setup(overrides: { strategy?: 'relative' | 'portal' } = {}) {
  const user = userEvent.setup();
  const handleNew = vi.fn();
  const handleSave = vi.fn();
  const handleDelete = vi.fn();
  const result = render(
    <DropdownMenu strategy={overrides.strategy}>
      <DropdownMenu.Button>Actions</DropdownMenu.Button>
      <DropdownMenu.List>
        <DropdownMenu.Item onClick={handleNew}>New File</DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleSave}>Save</DropdownMenu.Item>
        <DropdownMenu.Item onClick={handleDelete} disabled>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.List>
    </DropdownMenu>,
  );
  return { user, handleNew, handleSave, handleDelete, ...result };
}

describe('DropdownMenu', () => {
  it('renders trigger button', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();
  });

  it('menu is closed by default', () => {
    setup();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking button opens menu with 3 menuitems', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('clicking button again closes menu', async () => {
    const { user } = setup();
    const button = screen.getByRole('button', { name: 'Actions' });
    await user.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(button);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking item calls onClick and closes menu', async () => {
    const { user, handleNew } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'New File' }));
    expect(handleNew).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking disabled item does not call onClick and keeps menu open', async () => {
    const { user, handleDelete } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(handleDelete).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('disabled item has aria-disabled', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('button has correct ARIA attributes when closed', () => {
    setup();
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).not.toHaveAttribute('aria-controls');
  });

  it('button has correct ARIA attributes when open', async () => {
    const { user } = setup();
    const button = screen.getByRole('button', { name: 'Actions' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls');
  });

  it('keyboard: Enter on button opens menu', async () => {
    const { user } = setup();
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('keyboard: ArrowDown navigates to first item', async () => {
    const { user } = setup();
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'New File' })).toHaveFocus();
  });

  it('keyboard: ArrowDown skips disabled item and wraps', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    // Focus first item
    const newFile = screen.getByRole('menuitem', { name: 'New File' });
    newFile.focus();
    // ArrowDown -> Save
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
    // ArrowDown -> skip Delete (disabled) -> wrap to New File
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'New File' })).toHaveFocus();
  });

  it('keyboard: ArrowUp navigates backward', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const save = screen.getByRole('menuitem', { name: 'Save' });
    save.focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'New File' })).toHaveFocus();
  });

  it('keyboard: Enter selects item', async () => {
    const { user, handleNew } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const newFile = screen.getByRole('menuitem', { name: 'New File' });
    newFile.focus();
    await user.keyboard('{Enter}');
    expect(handleNew).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keyboard: Escape closes menu and returns focus to button', async () => {
    const { user } = setup();
    const button = screen.getByRole('button', { name: 'Actions' });
    await user.click(button);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('keyboard: Home moves to first enabled item', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const save = screen.getByRole('menuitem', { name: 'Save' });
    save.focus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'New File' })).toHaveFocus();
  });

  it('keyboard: End moves to last enabled item', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const newFile = screen.getByRole('menuitem', { name: 'New File' });
    newFile.focus();
    await user.keyboard('{End}');
    // Last enabled item is Save (index 1), Delete is disabled
    expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
  });

  it('clicking outside closes menu', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    // Click outside the component
    await user.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('menu closes and returns focus to button after item click', async () => {
    const { user } = setup();
    const button = screen.getByRole('button', { name: 'Actions' });
    await user.click(button);
    await user.click(screen.getByRole('menuitem', { name: 'New File' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('portal strategy renders menu in document.body', async () => {
    const { user } = setup({ strategy: 'portal' });
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const menu = screen.getByRole('menu');
    expect(menu.parentElement).toBe(document.body);
  });

  it('Tab closes menu and returns focus to button', async () => {
    const { user } = setup();
    const button = screen.getByRole('button', { name: 'Actions' });
    await user.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Tab}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('Space on button opens menu', async () => {
    const { user } = setup();
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard(' ');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('Space on menuitem selects it', async () => {
    const { user, handleSave } = setup();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const save = screen.getByRole('menuitem', { name: 'Save' });
    save.focus();
    await user.keyboard(' ');
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keyboard: ArrowUp on button opens menu and focuses last enabled item', async () => {
    const { user } = setup();
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    // Last enabled item is Save (index 1, Delete at index 2 is disabled)
    expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
  });

  it('portal strategy: clicking inside menu does not close it', async () => {
    const { user } = setup({ strategy: 'portal' });
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    // Click inside the menu (on a non-item area or the menu itself)
    await user.click(menu);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
