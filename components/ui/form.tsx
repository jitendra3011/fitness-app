import React, { createContext, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, useFormContext, FieldPath, FieldValues } from 'react-hook-form';

const FormFieldContext = createContext<{ name: string } | null>(null);
const FormItemContext = createContext<{ id: string } | null>(null);

export function Form({ children, ...props }: any) {
  return <View {...props}>{children}</View>;
}

export function FormField({ control, name, render }: any) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller control={control} name={name} render={render} />
    </FormFieldContext.Provider>
  );
}

export function FormItem({ children, ...props }: any) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={styles.formItem} {...props}>
        {children}
      </View>
    </FormItemContext.Provider>
  );
}

export function FormLabel({ children, ...props }: any) {
  return (
    <Text style={styles.formLabel} {...props}>
      {children}
    </Text>
  );
}

export function FormControl({ children }: any) {
  return <View style={styles.formControl}>{children}</View>;
}

export function FormDescription({ children, ...props }: any) {
  return (
    <Text style={styles.formDescription} {...props}>
      {children}
    </Text>
  );
}

export function FormMessage({ children, ...props }: any) {
  const fieldContext = useContext(FormFieldContext);
  const form = useFormContext();
  
  if (!fieldContext) return null;
  
  const error = form.formState.errors[fieldContext.name];
  const message = error?.message || children;
  
  if (!message) return null;
  
  return (
    <Text style={styles.formMessage} {...props}>
      {String(message)}
    </Text>
  );
}

const styles = StyleSheet.create({
  formItem: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  formControl: {
    marginBottom: 4,
  },
  formDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  formMessage: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});