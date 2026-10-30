interface ChipGroupProps<T extends string> {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

// A row of chips where exactly one is selected, like radio buttons.
// role="radiogroup" / role="radio" + aria-checked tell screen readers that.
// Generic <T>: the value type follows the options (DateRange, Region…).
export default function ChipGroup<T extends string>({ label, options, value, onChange }: ChipGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="chip-group">
      {options.map((o) => (
        <button key={o.value} role="radio" aria-checked={o.value === value} className="chip" onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
