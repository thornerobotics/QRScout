import BaseInputProps from './BaseInputProps';

export interface CounterInputProps extends BaseInputProps {
  min?: number;
  max?: number;
  step?: number;
  steps?: number[];
  defaultValue?: number;
}

export default function CounterInput(data: CounterInputProps) {
  function handleChange(increment: number) {
    const newVal = data.value + increment;
    if (data.max !== undefined && newVal > data.max) {
      // Don't fire the event if the new value would be greater than the max
      return;
    }
    if (data.min !== undefined && newVal < data.min) {
      // Don't fire the event if the new value would be less than the min
      return;
    }

    data.onChange(newVal);
  }

  // Multi-step mode: one large button per step + a small correction button
  if (data.steps && data.steps.length > 0) {
    return (
      <div className="my-2 flex flex-col items-center gap-2">
        <h2 className="text-3xl font-bold dark:text-white">{data.value}</h2>
        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
          {data.steps.map(s => (
            <button
              key={s}
              type="button"
              className="focus:shadow-outline h-14 w-16 rounded bg-gray-500 text-xl font-bold text-white hover:bg-gray-600 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => handleChange(s)}
            >
              +{s}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="focus:shadow-outline h-8 w-10 rounded bg-red-400 text-sm font-bold text-white hover:bg-red-600 focus:outline-none"
          onClick={() => handleChange(-1)}
        >
          -1
        </button>
      </div>
    );
  }

  // Legacy mode: original single +/- behavior
  return (
    <div className="my-2 flex flex-row items-center justify-center">
      <button
        className="focus:shadow-outline w-8 rounded bg-gray-500 text-2xl text-white hover:bg-red-700 focus:outline-none dark:bg-gray-700"
        type="button"
        onClick={() => handleChange(-(data.step || 1))}
      >
        -
      </button>
      <h2 className="px-4 text-2xl dark:text-white">{data.value}</h2>
      <button
        className="focus:shadow-outline w-8 rounded bg-gray-500 text-2xl  text-white hover:bg-red-700 focus:outline-none dark:bg-gray-700"
        type="button"
        onClick={() => handleChange(data.step || 1)}
      >
        +
      </button>
    </div>
  );
}
