import { NativeSelect, Select } from '@chakra-ui/react'
import React from 'react'

export default function SelectField({onChange, value, label, placeholder, children, ...props}) {
  return (
    <NativeSelect.Root disabled {...props}>
      <NativeSelect.Field
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      >
        {children}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  )
}
