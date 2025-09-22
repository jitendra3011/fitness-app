import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function TermsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Terms of Use</ThemedText>
          <ThemedText style={styles.subtitle}>SAI Official Talent Assessment Application</ThemedText>
          <View style={styles.metaInfo}>
            <ThemedText style={styles.meta}>Effective Date: January 1, 2025</ThemedText>
            <ThemedText style={styles.meta}>Issued by: Sports Authority of India (SAI)</ThemedText>
            <ThemedText style={styles.meta}>© 2025 Sports Authority of India. All rights reserved.</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>1. Acceptance of Terms</ThemedText>
          <ThemedText style={styles.content}>
            By downloading, accessing, or using the SAI Official Talent Assessment mobile application ("the App"), you ("the User", "Athlete", or "You") agree to comply with these Terms of Use. If you do not agree, you must not use the App.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>2. Purpose of the App</ThemedText>
          <ThemedText style={styles.content}>
            The App is developed and provided by the Sports Authority of India (SAI) to enable athletes to participate in standardized fitness assessments through mobile-based video submissions. The App is intended solely for sports talent identification, performance evaluation, and athlete profiling.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>3. Eligibility</ThemedText>
          <ThemedText style={styles.content}>
            • The App is open to all aspiring athletes residing in India.{'\n'}
            • Users under the age of 18 may use the App only under the supervision and consent of a parent or guardian.{'\n'}
            • By registering, you confirm that the information you provide is accurate and truthful.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>4. User Responsibilities</ThemedText>
          <ThemedText style={styles.content}>
            As a user of the App, you agree to:{'\n'}
            • Provide accurate personal details and performance data{'\n'}
            • Record assessment videos honestly without manipulation, alteration, or misrepresentation{'\n'}
            • Use the App only for the intended purpose of fitness assessment{'\n'}
            • Maintain confidentiality of login credentials{'\n'}
            • Comply with all applicable laws, regulations, and SAI guidelines
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>5. Prohibited Activities</ThemedText>
          <ThemedText style={styles.content}>
            You must not:{'\n'}
            • Upload false, misleading, or tampered performance data{'\n'}
            • Attempt to interfere with AI/ML analysis or cheat detection systems{'\n'}
            • Reverse-engineer, copy, or misuse any part of the App's code or algorithms{'\n'}
            • Use the App for commercial, fraudulent, or unlawful purposes{'\n'}
            • Infringe upon the intellectual property rights of SAI or third parties{'\n\n'}
            Violation of these rules may result in suspension, disqualification, or legal action.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>6. Data Usage & Privacy</ThemedText>
          <ThemedText style={styles.content}>
            • By using the App, you consent to the collection, storage, and use of your data as outlined in the Privacy Policy{'\n'}
            • Verified performance data will be shared with authorized SAI officials for evaluation and profiling{'\n'}
            • You retain the right to request correction or deletion of your data as per applicable privacy laws{'\n'}
            • Personal data is encrypted and stored securely on SAI servers
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>7. Intellectual Property & Rights</ThemedText>
          <ThemedText style={styles.content}>
            • All software, content, AI/ML algorithms, designs, and materials associated with the App are owned exclusively by SAI{'\n'}
            • Users are granted only a limited, non-transferable license to use the App for official talent assessment purposes{'\n'}
            • Unauthorized copying, distribution, or modification of the App or its content is strictly prohibited
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>8. Assessment Integrity</ThemedText>
          <ThemedText style={styles.content}>
            • All assessments must be performed in real-time without pre-recording{'\n'}
            • Video submissions are subject to AI-powered authenticity verification{'\n'}
            • Multiple attempts at the same assessment may be flagged for review{'\n'}
            • SAI reserves the right to request in-person verification of submitted performances
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>9. Disclaimers</ThemedText>
          <ThemedText style={styles.content}>
            • The App is provided "as is" without warranties of any kind{'\n'}
            • While SAI strives for accuracy in performance analysis, results generated by AI/ML modules are preliminary and subject to verification by SAI officials{'\n'}
            • SAI is not responsible for technical issues, device limitations, or network disruptions that may affect assessments
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>10. Limitation of Liability</ThemedText>
          <ThemedText style={styles.content}>
            SAI shall not be liable for:{'\n'}
            • Any indirect, incidental, or consequential damages arising from the use or inability to use the App{'\n'}
            • Loss of data or unauthorized access due to factors beyond SAI's reasonable control{'\n'}
            • Disqualification or rejection of a user's submission due to incorrect or tampered data{'\n'}
            • Injuries sustained during physical assessments
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>11. Termination of Access</ThemedText>
          <ThemedText style={styles.content}>
            SAI reserves the right to suspend or permanently terminate access to the App if a user:{'\n'}
            • Engages in fraudulent or prohibited activities{'\n'}
            • Violates these Terms of Use or applicable laws{'\n'}
            • Misuses the App in ways that compromise fairness, security, or integrity{'\n'}
            • Fails to comply with assessment guidelines
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>12. Changes to Terms</ThemedText>
          <ThemedText style={styles.content}>
            SAI may update or revise these Terms of Use at any time. Users will be notified of material changes through the App or the official SAI website. Continued use of the App after such changes constitutes acceptance of the revised Terms.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>13. Governing Law</ThemedText>
          <ThemedText style={styles.content}>
            These Terms of Use shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>14. Contact Information</ThemedText>
          <ThemedText style={styles.content}>
            For questions or concerns regarding these Terms of Use, please contact:{'\n\n'}
            Sports Authority of India (SAI){'\n'}
            Jawaharlal Nehru Stadium Complex{'\n'}
            Lodhi Road, New Delhi - 110003{'\n'}
            Email: support@sai.gov.in{'\n'}
            Phone: +91-11-2436-1531{'\n'}
            Website: www.sai.gov.in
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            By using this application, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  metaInfo: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
  },
  meta: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
  },
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});