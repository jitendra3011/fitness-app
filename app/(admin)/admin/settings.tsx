import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Switch, TextInput } from 'react-native';

interface SettingsState {
  aiDetection: boolean;
  autoApproval: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  aiThreshold: number;
  maxSubmissions: number;
  sessionTimeout: number;
}

export default function AdminSettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    aiDetection: true,
    autoApproval: false,
    emailNotifications: true,
    smsNotifications: false,
    aiThreshold: 75,
    maxSubmissions: 5,
    sessionTimeout: 30
  });

  const [benchmarks, setBenchmarks] = useState({
    athletics: { male: { pushUps: 30, sitUps: 40, running: 12 }, female: { pushUps: 20, sitUps: 35, running: 14 } },
    wrestling: { male: { pushUps: 35, sitUps: 45, running: 11 }, female: { pushUps: 25, sitUps: 40, running: 13 } }
  });

  const updateSetting = (key: keyof SettingsState, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    console.log('Saving settings:', settings);
    // API call would be made here
  };

  const exportData = () => {
    console.log('Exporting data...');
    // Export functionality would be implemented here
  };

  const resetSystem = () => {
    console.log('Resetting system...');
    // Reset functionality would be implemented here
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>⚙️ Admin Settings</ThemedText>
            <ThemedText style={styles.subtitle}>Configure system parameters and preferences</ThemedText>
          </View>
          <Pressable style={styles.saveButton} onPress={saveSettings}>
            <IconSymbol size={16} name="checkmark.circle.fill" color="#FFFFFF" />
            <ThemedText style={styles.saveText}>Save All</ThemedText>
          </Pressable>
        </View>

        {/* AI & Detection Settings */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>🤖 AI Detection Settings</ThemedText>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold" style={styles.settingLabel}>AI Cheat Detection</ThemedText>
                <ThemedText style={styles.settingDescription}>Enable AI-powered video analysis for cheating detection</ThemedText>
              </View>
              <Switch 
                value={settings.aiDetection} 
                onValueChange={(value) => updateSetting('aiDetection', value)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={settings.aiDetection ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold" style={styles.settingLabel}>AI Confidence Threshold</ThemedText>
                <ThemedText style={styles.settingDescription}>Minimum confidence level for AI flagging (%)</ThemedText>
              </View>
              <TextInput
                style={styles.numberInput}
                value={settings.aiThreshold.toString()}
                onChangeText={(text) => updateSetting('aiThreshold', parseInt(text) || 75)}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold" style={styles.settingLabel}>Auto-Approval</ThemedText>
                <ThemedText style={styles.settingDescription}>Automatically approve submissions above threshold</ThemedText>
              </View>
              <Switch 
                value={settings.autoApproval} 
                onValueChange={(value) => updateSetting('autoApproval', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor={settings.autoApproval ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>📧 Notification Settings</ThemedText>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold" style={styles.settingLabel}>Email Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>Receive email alerts for new submissions</ThemedText>
              </View>
              <Switch 
                value={settings.emailNotifications} 
                onValueChange={(value) => updateSetting('emailNotifications', value)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={settings.emailNotifications ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold" style={styles.settingLabel}>SMS Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>Receive SMS alerts for flagged submissions</ThemedText>
              </View>
              <Switch 
                value={settings.smsNotifications} 
                onValueChange={(value) => updateSetting('smsNotifications', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor={settings.smsNotifications ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        {/* System Limits */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>🔒 System Limits</ThemedText>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold" style={styles.settingLabel}>Max Submissions per Day</ThemedText>
                <ThemedText style={styles.settingDescription}>Maximum video submissions per athlete per day</ThemedText>
              </View>
              <TextInput
                style={styles.numberInput}
                value={settings.maxSubmissions.toString()}
                onChangeText={(text) => updateSetting('maxSubmissions', parseInt(text) || 5)}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold" style={styles.settingLabel}>Session Timeout</ThemedText>
                <ThemedText style={styles.settingDescription}>Admin session timeout in minutes</ThemedText>
              </View>
              <TextInput
                style={styles.numberInput}
                value={settings.sessionTimeout.toString()}
                onChangeText={(text) => updateSetting('sessionTimeout', parseInt(text) || 30)}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        </View>

        {/* Performance Benchmarks */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>🎯 Performance Benchmarks</ThemedText>
          
          <View style={styles.benchmarkCard}>
            <ThemedText type="defaultSemiBold" style={styles.benchmarkTitle}>Athletics Standards</ThemedText>
            
            <View style={styles.benchmarkGrid}>
              <View style={styles.benchmarkColumn}>
                <ThemedText style={styles.benchmarkHeader}>Male</ThemedText>
                <View style={styles.benchmarkItem}>
                  <ThemedText style={styles.benchmarkLabel}>Push-ups:</ThemedText>
                  <TextInput style={styles.benchmarkInput} value="30" keyboardType="numeric" />
                </View>
                <View style={styles.benchmarkItem}>
                  <ThemedText style={styles.benchmarkLabel}>Sit-ups:</ThemedText>
                  <TextInput style={styles.benchmarkInput} value="40" keyboardType="numeric" />
                </View>
                <View style={styles.benchmarkItem}>
                  <ThemedText style={styles.benchmarkLabel}>1.5km (min):</ThemedText>
                  <TextInput style={styles.benchmarkInput} value="12" keyboardType="numeric" />
                </View>
              </View>
              
              <View style={styles.benchmarkColumn}>
                <ThemedText style={styles.benchmarkHeader}>Female</ThemedText>
                <View style={styles.benchmarkItem}>
                  <ThemedText style={styles.benchmarkLabel}>Push-ups:</ThemedText>
                  <TextInput style={styles.benchmarkInput} value="20" keyboardType="numeric" />
                </View>
                <View style={styles.benchmarkItem}>
                  <ThemedText style={styles.benchmarkLabel}>Sit-ups:</ThemedText>
                  <TextInput style={styles.benchmarkInput} value="35" keyboardType="numeric" />
                </View>
                <View style={styles.benchmarkItem}>
                  <ThemedText style={styles.benchmarkLabel}>1.5km (min):</ThemedText>
                  <TextInput style={styles.benchmarkInput} value="14" keyboardType="numeric" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>💾 Data Management</ThemedText>
          
          <View style={styles.actionGrid}>
            <Pressable style={[styles.actionCard, styles.exportCard]} onPress={exportData}>
              <IconSymbol size={32} name="square.and.arrow.up" color="#3B82F6" />
              <ThemedText type="defaultSemiBold" style={styles.actionTitle}>Export Data</ThemedText>
              <ThemedText style={styles.actionSubtitle}>Download all athlete data and submissions</ThemedText>
            </Pressable>
            
            <Pressable style={[styles.actionCard, styles.backupCard]}>
              <IconSymbol size={32} name="externaldrive" color="#10B981" />
              <ThemedText type="defaultSemiBold" style={styles.actionTitle}>Backup System</ThemedText>
              <ThemedText style={styles.actionSubtitle}>Create system backup</ThemedText>
            </Pressable>
            
            <Pressable style={[styles.actionCard, styles.resetCard]} onPress={resetSystem}>
              <IconSymbol size={32} name="arrow.clockwise" color="#F59E0B" />
              <ThemedText type="defaultSemiBold" style={styles.actionTitle}>Reset System</ThemedText>
              <ThemedText style={styles.actionSubtitle}>Clear all data and reset to defaults</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* System Info */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>ℹ️ System Information</ThemedText>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Version:</ThemedText>
              <ThemedText style={styles.infoValue}>SAI Portal v2.1.0</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Last Updated:</ThemedText>
              <ThemedText style={styles.infoValue}>January 15, 2024</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Database Size:</ThemedText>
              <ThemedText style={styles.infoValue}>2.4 GB</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Active Sessions:</ThemedText>
              <ThemedText style={styles.infoValue}>3 admins online</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    gap: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  numberInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
    minWidth: 60,
  },
  benchmarkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  benchmarkTitle: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  benchmarkGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  benchmarkColumn: {
    flex: 1,
  },
  benchmarkHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 12,
    textAlign: 'center',
  },
  benchmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  benchmarkLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  benchmarkInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    minWidth: 50,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  exportCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  backupCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  resetCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  actionTitle: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
});