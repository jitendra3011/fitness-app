import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

export default function TermsConditions() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={styles.heroHeader}>
          <IconSymbol size={48} name="doc.text.below.ecg" color="#10B981" />
          <ThemedText type="title" style={styles.heroTitle}>
            📋 Terms & Conditions
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>💪 BodyMetrics Fitness App</ThemedText>
          <View style={styles.lastUpdated}>
            <IconSymbol size={16} name="calendar.badge.clock" color="#6B7280" />
            <ThemedText style={styles.dateText}>📅 Effective: January 2025</ThemedText>
          </View>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          <TermsCard 
            icon="building.2.fill"
            title="🏢 SAI Official Talent Assessment Application"
            content={[
              "Effective Date: September 21, 2025",
              "Issued by: Sports Authority of India (SAI)",
              "© 2025 Sports Authority of India. All rights reserved."
            ]}
          />

          
          <TermsCard 
            icon="checkmark.seal.fill"
            title="✅ Acceptance of Terms"
            content={[
              "By downloading, accessing, or using the SAI Official Talent Assessment mobile application (\"the App\"), you (\"the User\", \"Athlete\", or \"You\") agree to comply with these Terms of Use. If you do not agree, you must not use the App."
            ]}
          />

          
          <TermsCard 
            icon="target"
            title="🎯 Purpose of the App"
            content={[
              "The App is developed and provided by the Sports Authority of India (SAI) to enable athletes to participate in standardized fitness assessments through mobile-based video submissions. The App is intended solely for sports talent identification, performance evaluation, and athlete profiling."
            ]}
          />

          
          <TermsCard 
            icon="person.crop.circle.badge.checkmark"
            title="👤 Eligibility"
            content={[
              "• The App is open to all aspiring athletes residing in India.",
              "• Users under the age of 18 may use the App only under the supervision and consent of a parent or guardian.",
              "• By registering, you confirm that the information you provide is accurate and truthful."
            ]}
          />

          
          <TermsCard 
            icon="list.clipboard.fill"
            title="📝 User Responsibilities"
            content={[
              "As a user of the App, you agree to:",
              "• Provide accurate personal details and performance data",
              "• Record assessment videos honestly without manipulation or misrepresentation",
              "• Use the App only for the intended purpose of fitness assessment",
              "• Maintain confidentiality of login credentials",
              "• Comply with all applicable laws, regulations, and SAI guidelines"
            ]}
          />

          
          <TermsCard 
            icon="exclamationmark.triangle.fill"
            title="⚠️ Prohibited Activities"
            content={[
              "You must not:",
              "• Upload false, misleading, or tampered performance data",
              "• Attempt to interfere with AI/ML analysis or cheat detection systems",
              "• Reverse-engineer, copy, or misuse any part of the App's code or algorithms",
              "• Use the App for commercial, fraudulent, or unlawful purposes",
              "• Infringe upon the intellectual property rights of SAI or third parties",
              "⚠️ Violation of these rules may result in suspension, disqualification, or legal action."
            ]}
            isWarning
          />

          
          <TermsCard 
            icon="shield.lefthalf.filled"
            title="🔒 Data Usage & Privacy"
            content={[
              "• By using the App, you consent to the collection, storage, and use of your data as outlined in the Privacy Policy",
              "• Verified performance data will be shared with authorized SAI officials for evaluation and profiling",
              "• You retain the right to request correction or deletion of your data as per the Privacy Policy"
            ]}
          />

          
          <TermsCard 
            icon="c.circle.fill"
            title="©️ Intellectual Property Rights"
            content={[
              "• All software, content, AI/ML algorithms, designs, and materials associated with the App are owned exclusively by SAI",
              "• Users are granted only a limited, non-transferable license to use the App for official talent assessment purposes",
              "• Unauthorized copying, distribution, or modification of the App or its content is strictly prohibited"
            ]}
          />

          
          <TermsCard 
            icon="checkmark.shield.fill"
            title="❤️ Assessment Integrity"
            content={[
              "• All fitness assessments must be performed honestly and without external assistance",
              "• Video submissions must be unedited and represent genuine performance",
              "• SAI reserves the right to verify results through additional testing or interviews",
              "• False submissions may result in permanent disqualification from SAI programs"
            ]}
          />

          
          <TermsCard 
            icon="info.circle.fill"
            title="ℹ️ Disclaimers"
            content={[
              "• The App is provided \"as is\" without warranties of any kind",
              "• While SAI strives for accuracy in performance analysis, results generated by AI/ML modules are preliminary and subject to verification",
              "• SAI is not responsible for technical issues, device limitations, or network disruptions that may affect assessments"
            ]}
          />

          <TermsCard 
            icon="exclamationmark.shield.fill"
            title="⚠️ Limitation of Liability"
            content={[
              "SAI shall not be liable for:",
              "• Any indirect, incidental, or consequential damages arising from the use or inability to use the App",
              "• Loss of data or unauthorized access due to factors beyond SAI's reasonable control",
              "• Disqualification or rejection of a user's submission due to incorrect or tampered data"
            ]}
            isWarning
          />

          <TermsCard 
            icon="xmark.circle.fill"
            title="❌ Termination of Access"
            content={[
              "SAI reserves the right to suspend or permanently terminate access to the App if a user:",
              "• Engages in fraudulent or prohibited activities",
              "• Violates these Terms of Use or applicable laws",
              "• Misuses the App in ways that compromise fairness, security, or integrity"
            ]}
            isWarning
          />

          <TermsCard 
            icon="arrow.triangle.2.circlepath"
            title="🔄 Changes to Terms"
            content={[
              "SAI may update or revise these Terms of Use at any time. Users will be notified of material changes through the App or the official SAI website. Continued use of the App after such changes constitutes acceptance of the revised Terms."
            ]}
          />

          <TermsCard 
            icon="scale.3d"
            title="⚖️ Governing Law"
            content={[
              "These Terms of Use shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India."
            ]}
          />

          <TermsCard 
            icon="envelope.circle.fill"
            title="📧 Contact Information"
            content={[
              "For questions or concerns regarding these Terms of Use, please contact:",
              "Sports Authority of India (SAI)",
              "Jawaharlal Nehru Stadium Complex",
              "Lodhi Road, New Delhi - 110003",
              "Email: support@sai.gov.in",
              "Phone: +91-11-2436-1531"
            ]}
            isLast
          />

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              By using this application, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </ThemedText>
            <ThemedText style={styles.footerText}>Last updated: September 21, 2025</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function TermsCard({ icon, title, content, isWarning = false, isLast = false }: {
  icon: string;
  title: string;
  content: string[];
  isWarning?: boolean;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.termsCard, isLast && styles.lastCard, isWarning && styles.warningCard]}>
      <View style={styles.cardHeader}>
        <IconSymbol size={24} name={icon as any} color={isWarning ? "#EF4444" : "#10B981"} />
        <ThemedText type="subtitle" style={[styles.cardTitle, isWarning && styles.warningTitle]}>{title}</ThemedText>
      </View>
      {content.map((text, index) => (
        <ThemedText key={index} style={[styles.cardContent, text.includes('⚠️') && styles.warningText]}>
          {text}
        </ThemedText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
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
  termsCard: {
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
    borderColor: '#D1FAE5',
  },
  warningCard: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FFFBFB',
  },
  lastCard: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#D1FAE5',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  warningTitle: {
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 8,
  },
  warningText: {
    color: '#DC2626',
    fontWeight: '500',
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
});