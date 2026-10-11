type TwoWayToggleProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  left: {
    value: T;
    label: string;
  };
  right: {
    value: T;
    label: string;
  };
};

export const TwoWayToggle = <T extends string>({
  value,
  onChange,
  left,
  right,
}: TwoWayToggleProps<T>) => {
  return (
    <div className="two-way-toggle">
      <button
        type="button"
        className={value === left.value ? 'active' : ''}
        onClick={() => onChange(left.value)}
      >
        {left.label}
      </button>

      <button
        type="button"
        className={value === right.value ? 'active' : ''}
        onClick={() => onChange(right.value)}
      >
        {right.label}
      </button>
    </div>
  );
};
