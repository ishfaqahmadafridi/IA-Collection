import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ProfileImageUpload from '../../components/profile/ProfileImageUpload';
import { clearSession } from '../../utils/session';
const createObjectURL = vi.fn();
const revokeObjectURL = vi.fn();
beforeEach(() => {
  clearSession();
  let next = 0;
  createObjectURL.mockReset().mockImplementation(() => `blob:preview-${++next}`);
  revokeObjectURL.mockReset();
  vi.stubGlobal('URL', Object.assign(class extends URL {}, { createObjectURL, revokeObjectURL }));
});
afterEach(() => { vi.unstubAllGlobals(); });
describe('profile image previews', () => {
  it('revokes replaced previews and releases the last URL on unmount', () => {
    const { unmount } = render(<ProfileImageUpload />);
    const input = screen.getByLabelText('Choose Image');
    fireEvent.change(input, { target: { files: [new File(['png'], 'first.png', { type: 'image/png' })] } });
    expect(screen.getByRole('img').getAttribute('src')).toBe('blob:preview-1');
    fireEvent.change(input, { target: { files: [new File(['png'], 'second.png', { type: 'image/png' })] } });
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:preview-1');
    unmount();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:preview-2');
  });
  it('does not create preview URLs for unsupported files', () => {
    render(<ProfileImageUpload />);
    fireEvent.change(screen.getByLabelText('Choose Image'), { target: { files: [new File(['bad'], 'bad.txt', { type: 'text/plain' })] } });
    expect(screen.getByRole('alert').textContent).toContain('Choose a JPEG');
    expect(createObjectURL).not.toHaveBeenCalled();
  });
});
