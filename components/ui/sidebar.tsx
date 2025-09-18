import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Pressable, StyleSheet, View } from 'react-native';

type SidebarContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const width = Math.min(280, Math.floor(Dimensions.get('window').width * 0.8));
  const translate = useRef(new Animated.Value(-width)).current;

  const animateTo = useCallback((toValue: number) => {
    Animated.timing(translate, {
      toValue,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [translate]);

  const open = useCallback(() => {
    setIsOpen(true);
    animateTo(0);
  }, [animateTo]);

  const close = useCallback(() => {
    animateTo(-width);
    setTimeout(() => setIsOpen(false), 220);
  }, [animateTo, width]);

  const toggle = useCallback(() => {
    if (isOpen) close(); else open();
  }, [isOpen, open, close]);

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
      <SidebarOverlay visible={isOpen} onPress={close} />
      <Animated.View style={[styles.panel, { width, transform: [{ translateX: translate }] }]}
        pointerEvents={isOpen ? 'auto' : 'none'}>
        <View style={styles.panelInner}>
          {/* Consumers will render menu content via Sidebar.Slot */}
          <SidebarSlot />
        </View>
      </Animated.View>
    </SidebarContext.Provider>
  );
}

// A lightweight slot system to inject content into the sidebar
let sidebarContent: React.ReactNode = null;
function SidebarSlot() { return <>{sidebarContent}</>; }

export function SidebarContent({ children }: { children: React.ReactNode }) {
  sidebarContent = children;
  return null;
}

export function SidebarTrigger({ children }: { children: React.ReactNode }) {
  const { toggle } = useSidebar();
  return (
    <Pressable onPress={toggle} hitSlop={8} style={styles.trigger}>
      {children}
    </Pressable>
  );
}

function SidebarOverlay({ visible, onPress }: { visible: boolean; onPress: () => void }) {
  if (!visible) return null;
  return <Pressable style={styles.overlay} onPress={onPress} />;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  panelInner: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    gap: 8,
  },
  trigger: {
    padding: 6,
  },
});

export const Sidebar = {
  Provider: SidebarProvider,
  Trigger: SidebarTrigger,
  Content: SidebarContent,
};


