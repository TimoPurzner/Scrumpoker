import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './button';

describe('Button Component', () => {

    it('should call the callback function on click', () => {
        const testObject = {test: ():any => {}};
        jest.spyOn(testObject, 'test');
        const {container} = render(<Button onClick={testObject.test}>Test</Button>);
        const button = container.querySelector('button');
        button?.click();
        expect(testObject.test).toHaveBeenCalled();
    });
    
    it('should not show loading indicator', () => {
        const {container} = render(<Button loading={true} onClick={() => {}}>Test</Button>);
        const button = container.querySelector('button');
        expect(screen.getByText(/Loading/)).toBeTruthy();
        expect(screen.queryByText(/Test/)).toBeNull();
    });
    
    it('should display children if not loading', () => {
        const {container} = render(<Button loading={false} onClick={() => {}}>Test</Button>);
        const button = container.querySelector('button');
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
