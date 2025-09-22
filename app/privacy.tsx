import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function PrivacyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={styles.heroHeader}>
          <IconSymbol size={48} name="shield.lefthalf.filled" color="#3B82F6" />
          <ThemedText type="title" style={styles.heroTitle}>
            🔒 Privacy Policy
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>💪 BodyMetrics Fitness App</ThemedText>
          <View style={styles.lastUpdated}>
            <IconSymbol size={16} name="calendar.badge.clock" color="#6B7280" />
            <ThemedText style={styles.dateText}>📅 Last Updated: September 2025</ThemedText>
          </View>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          <PolicySection 
            icon="doc.text.magnifyingglass"
            title="📊 Information We Collect"
            content="We collect information you provide directly, such as account details, fitness goals, and workout data. We also collect usage information and device data to improve our services."
          />
          
          <PolicySection 
            icon="gearshape.2.fill"
            title="⚙️ How We Use Your Information"
            content="Your information helps us provide personalized fitness recommendations, track your progress, and improve our app features. We never sell your personal data to third parties."
          />
          
          <PolicySection 
            icon="lock.shield.fill"
            title="🔐 Data Security"
            content="We implement industry-standard security measures to protect your data, including encryption and secure servers. Your fitness data is stored securely and accessed only by authorized personnel."
          />
          
          <PolicySection 
            icon="person.crop.circle.badge.checkmark"
            title="👤 Your Rights"
            content="You have the right to access, update, or delete your personal information. You can also opt out of certain data collection practices through your account settings."
          />
          
          <PolicySection 
            icon="envelope.badge.fill"
            title="📧 Contact Us"
            content="If you have questions about this privacy policy, please contact us at privacy@bodymetrics.com or through the app's support section."
            isLast
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function PolicySection({ icon, title, content, isLast = false }: {
  icon: string;
  title: string;
  content: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.policyCard, isLast && styles.lastCard]}>
      <View style={styles.cardHeader}>
        <IconSymbol size={24} name={icon as any} color="#3B82F6" />
        <ThemedText type="subtitle" style={styles.cardTitle}>{title}</ThemedText>
      </View>
      <ThemedText style={styles.cardContent}>{content}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 16,
  },

  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
  },
  heroSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    color: '#6B7280',
  },
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  lastCard: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    textAlign: 'left',
  },
});