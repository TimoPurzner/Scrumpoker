
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import './estimation-cards.scss';

type EstimationCardSetProps = {
    className?: string;
    value: string;
    options: string[];
    onChange: Function;
    onReset?: Function;
  };

const EstimationCardSet = forwardRef((props: EstimationCardSetProps, ref) => {
    
    const estimationForm = useRef(null);

    useImperativeHandle(ref, () => ({

        resetForm() {
            const form = estimationForm.current;
            if (form) {
                (form as HTMLFormElement).reset();
                if(props.onReset) props.onReset();
            }
        }

    })) as any;

    return (
        <form ref={estimationForm}>
            <div className='estimation-card-set'>
                {props.options.map((option, index) => (
                <span key={index} className='poker-card'>
                <input
                    id={index.toString()}
                    checked={option === props.value}
                    className='poker-card__input'
                    type='radio'
                    name='estimation'
                    value={option}
                    onChange={() => props.onChange(option)}
                />
                <label className='poker-card__label' htmlFor={index.toString()}>
                    {option}
                </label>
                </span>
            ))}
            </div>
      </form>
    )
});

export default EstimationCardSet;