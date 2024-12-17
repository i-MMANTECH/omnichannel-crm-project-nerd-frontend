export const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'var(--input-background)',
      color: 'var(--input-text)',
      borderColor: 'rgba(var(--input-text-rgb), 0.2)',
      '&:hover': {
        borderColor: 'rgba(var(--input-text-rgb), 0.4)'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--input-background)',
      color: 'var(--input-text)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'rgba(var(--link-color-rgb), 0.2)' 
        : state.isFocused 
          ? 'rgba(var(--input-text-rgb), 0.1)' 
          : 'var(--input-background)',
      color: 'var(--input-text)',
      '&:hover': {
        backgroundColor: 'rgba(var(--input-text-rgb), 0.1)',
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--input-text)',
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--input-text)',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(var(--input-text-rgb), 0.5)',
    })
  };
