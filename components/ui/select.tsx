import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface SelectProps {
  onValueChange: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: { value: string; label: string }[];
  setItems: (items: { value: string; label: string }[]) => void;
} | null>(null);

export function Select({ onValueChange, defaultValue = '', children }: SelectProps) {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{
      value,
      onValueChange: handleValueChange,
      isOpen,
      setIsOpen,
      items,
      setItems
    }}>
      {children}
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');

  return (
    <Pressable
      style={styles.trigger}
      onPress={() => context.setIsOpen(true)}
    >
      {children}
      <IconSymbol size={16} name="chevron.down" color="#6B7280" />
    </Pressable>
  );
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');

  const selectedItem = context.items.find(item => item.value === context.value);
  
  return (
    <Text style={[styles.value, !selectedItem && styles.placeholder]}>
      {selectedItem ? selectedItem.label : placeholder}
    </Text>
  );
}

export function SelectContent({ children }: SelectContentProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');

  // Collect items from children
  React.useEffect(() => {
    const items: { value: string; label: string }[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && (child as React.ReactElement<SelectItemProps>).props.value) {
        const childProps = (child as React.ReactElement<SelectItemProps>).props;
        items.push({
          value: childProps.value,
          label: typeof childProps.children === 'string' ? childProps.children : childProps.value
        });
      }
    });
    context.setItems(items);
  }, [children]);

  return (
    <Modal
      visible={context.isOpen}
      transparent
      animationType="fade"
      onRequestClose={() => context.setIsOpen(false)}
    >
      <Pressable 
        style={styles.overlay}
        onPress={() => context.setIsOpen(false)}
      >
        <View style={styles.content}>
          <FlatList
            data={context.items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => context.onValueChange(item.value)}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

export function SelectItem({ value, children }: SelectItemProps) {
  // This component is used for structure but actual rendering is handled by SelectContent
  return null;
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  value: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholder: {
    color: '#9CA3AF',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 300,
    minWidth: 200,
    margin: 20,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  itemText: {
    fontSize: 16,
    color: '#111827',
  },
});