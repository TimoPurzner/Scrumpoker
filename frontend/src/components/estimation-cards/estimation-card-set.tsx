
import { useRef } from 'react';
import './estimation-cards.scss';

type EstimationCardSetProps = {
    className?: string;
    value: string;
    options: string[];
    onChange: Function;
    onReset?: Function;
  };

export default function EstimationCardSet(props: EstimationCardSetProps) {
    
    const estimationForm = useRef(null);

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
};