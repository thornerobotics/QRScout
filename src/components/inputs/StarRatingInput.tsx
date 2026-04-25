import { useState } from 'preact/hooks';
import BaseInputProps from './BaseInputProps';

export interface StarRatingInputProps extends BaseInputProps {
  defaultValue?: number;
}

export default function StarRatingInput(data: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number>(0);
  const current = (data.value as number) ?? 0;

  return (
    <div className="flex flex-row px-2 py-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`text-2xl leading-none focus:outline-none ${
            star <= (hovered || current)
              ? 'text-gray-400'
              : 'text-gray-300 dark:text-gray-700'
          }`}
          onClick={() => data.onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
