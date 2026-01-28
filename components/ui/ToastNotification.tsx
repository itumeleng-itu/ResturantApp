import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type ToastNotificationProps = {
  message: string;
  title?: string;
  type?: 'success' | 'error' | 'info';
  onHide: () => void;
  visible: boolean;
};

export const ToastNotification = ({ message, title, type = 'info', onHide, visible }: ToastNotificationProps) => {
  if (!visible) return null;

  return (
    <Animated.View 
      entering={FadeInUp.springify()} 
      exiting={FadeOutUp}
      style={styles.container}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.content}>
           <View style={[styles.iconContainer, type === 'success' && styles.successIcon]}>
              <MaterialIcons 
                name={type === 'success' ? "check-circle" : "notifications"} 
                size={24} 
                color="#fff" 
              />
           </View>
           <View style={styles.textContainer}>
              {title && <Text style={styles.title}>{title}</Text>}
              <Text style={styles.message}>{message}</Text>
           </View>
           <TouchableOpacity onPress={onHide} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
             <MaterialIcons name="close" size={20} color="#9CA3AF" />
           </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  safeArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  successIcon: {
    backgroundColor: '#10B981',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
