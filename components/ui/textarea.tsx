import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface TextareaProps extends TextInputProps {
  className?: string;
}

export function Textarea({ style, className, ...props }: TextareaProps) {
  return (
    <TextInput
      style={[styles.textarea, style]}
      multiline
      textAlignVertical="top"
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    minHeight: 80,
  },
});