import React, {
  SelectHTMLAttributes,
  useCallback,
  useState,
  useEffect,
} from 'react'

enum PropertyType {
  NUMBER = 'Number',
  BOOLEAN = 'Boolean',
  STRING = 'String',
}

export const SelectTypeInput = (
  props: SelectHTMLAttributes<HTMLSelectElement>,
) => {
  return (
    <select {...props}>
      {Object.keys(PropertyType).map(type => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  )
}

export type Property = {
  type: PropertyType
  name: string
}
export const ResultProperty = ({
  onChange,
  name,
}: {
  name: string
  onChange: (name: string, prop: Property) => void
}) => {
  const [property, setProperty] = useState<Property>({
    type: PropertyType.NUMBER,
    name: '',
  })
  useEffect(() => {
    onChange(name, property)
  }, [property, name])

  const onSelect = useCallback(
    e => {
      setProperty({ type: e.target.value, name: property.name })
    },
    [setProperty, property],
  )

  const onNameChange = useCallback(
    e => {
      setProperty({ name: e.target.value, type: property.type })
    },
    [setProperty, property],
  )

  return (
    <div>
      <input
        value={property.name}
        onChange={onNameChange}
        type="text"
        placeholder="Property Name"
      />
      <SelectTypeInput defaultValue={property.type} onChange={onSelect} />
    </div>
  )
}
