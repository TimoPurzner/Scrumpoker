import { render, screen } from '@testing-library/react';
import Button from './button';

describe('Button Component', () => {

    it('should call the callback function on click', () => {
        const testObject = {callback: () => {}};
        jest.spyOn(testObject, 'callback');
        const {container} = render(<Button onClick={testObject.callback}>Test</Button>);
        const button = container.querySelector('button');
        button.click();
        expect(testObject.callback).toHaveBeenCalled();
    });

    
    it('should not show loading indicator', () => {
        render(<Button loading={true} onClick={() => {}}>Test</Button>);
        expect(screen.getByText(/Loading/)).toBeTruthy();
        expect(screen.queryByText(/Test/)).toBeNull();
    });
    
    it('should display children if not loading', () => {
        render(<Button loading={false} onClick={() => {}}>Test</Button>);
        expect(screen.getByText(/Test/)).toBeTruthy();
    });
    
    it('should disable button while loading', () => {
        const {container} = render(<Button loading={true} onClick={() => {}}>Test</Button>);
        const button = container.querySelector('button');
        expect(button.getAttribute('disabled')).toBe('');
    });
    
    it('should disable button while disabled', () => {
        const {container} = render(<Button disabled={true} onClick={() => {}}>Test</Button>);
        const button = container.querySelector('button');
        expect(button.getAttribute('disabled')).toBe('');
    });

});
