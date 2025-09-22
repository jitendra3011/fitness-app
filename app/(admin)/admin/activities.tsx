import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';

interface VideoSubmission {
  id: string;
  athleteName: string;
  athleteId: string;
  sport: string;
  testType: string;
  submissionDate: string;
  aiAnalysis: {
    score: number;
    flagged: boolean;
    confidence: number;
    issues?: string[];
  };
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewedBy?: string;
}

const mockSubmissions: VideoSubmission[] = [
  {
    id: 'VID001',
    athleteName: 'Rajesh Kumar',
    athleteId: 'ATH001',
    sport: 'Athletics',
    testType: 'Vertical Jump',
    submissionDate: '2024-01-15',
    aiAnalysis: {
      score: 85,
      flagged: false,
      confidence: 92
    },
    status: 'pending'
  },
  {
    id: 'VID002',
    athleteName: 'Arjun Singh',
    athleteId: 'ATH003',
    sport: 'Boxing',
    testType: 'Sit-ups',
    submissionDate: '2024-01-13',
    aiAnalysis: {
      score: 45,
      flagged: true,
      confidence: 78,
      issues: ['Frame skip detected', 'Inconsistent timing']
    },
    status: 'pending'
  },
  {
    id: 'VID003',
    athleteName: 'Priya Sharma',
    athleteId: 'ATH002',
    sport: 'Wrestling',
    testType: 'Push-ups',
    submissionDate: '2024-01-14',
    aiAnalysis: {
      score: 92,
      flagged: false,
      confidence: 95
    },
    status: 'approved',
    reviewedBy: 'Admin User'
  }
];

export default function AdminActivitiesScreen() {
  const [selectedSubmission, setSelectedSubmission] = useState<VideoSubmission | null>(null);
  const [submissions, setSubmissions] = useState<VideoSubmission[]>(mockSubmissions);

  const handleApprove = (submissionId: string) => {
    setSubmissions(prev => prev.map(submission => 
      submission.id === submissionId ? { ...submission, status: 'approved', reviewedBy: 'Admin User' } : submission
    ));
  };

  const handleReject = (submissionId: string) => {
    setSubmissions(prev => prev.map(submission => 
      submission.id === submissionId ? { ...submission, status: 'rejected', reviewedBy: 'Admin User' } : submission
    ));
  };

  const handlePlayVideo = (submissionId: string) => {
    // Video player functionality would be implemented here
    console.log('Playing video:', submissionId);
  };

  const handleViewAnalysis = (submissionId: string) => {
    // AI analysis view functionality would be implemented here
    console.log('Viewing AI analysis:', submissionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'reviewed': return '#8B5CF6';
      default: return '#F59E0B';
    }
  };

  const getAIScoreColor = (score: number, flagged: boolean) => {
    if (flagged) return '#EF4444';
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>📹 Video Submissions</ThemedText>
            <ThemedText style={styles.subtitle}>AI-powered video analysis and review system</ThemedText>
          </View>
          <View style={styles.aiSummary}>
            <IconSymbol size={24} name="eye.trianglebadge.exclamationmark" color="#EF4444" />
            <ThemedText style={styles.aiText}>AI Flagged: 1</ThemedText>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatsCard icon="video.fill" title="Total Videos" value="156" color="#3B82F6" />
          <StatsCard icon="clock.fill" title="Pending Review" value="23" color="#F59E0B" />
          <StatsCard icon="checkmark.circle.fill" title="Approved" value="98" color="#10B981" />
          <StatsCard icon="exclamationmark.triangle.fill" title="AI Flagged" value="8" color="#EF4444" />
        </View>

        {/* Video Submissions List */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>🔍 Recent Submissions</ThemedText>
          
          {submissions.map(submission => (
            <View key={submission.id} style={styles.submissionCard}>
              <View style={styles.submissionHeader}>
                <View style={styles.submissionInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.submissionTitle}>
                    {submission.athleteName} - {submission.testType}
                  </ThemedText>
                  <ThemedText style={styles.submissionMeta}>
                    ID: {submission.athleteId} • {submission.sport} • {submission.submissionDate}
                  </ThemedText>
                </View>
                
                <View style={styles.statusSection}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(submission.status) + '20' }]}>
                    <ThemedText style={[styles.statusText, { color: getStatusColor(submission.status) }]}>
                      {submission.status.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>
              </View>

              {/* AI Analysis */}
              <View style={styles.aiAnalysisSection}>
                <View style={styles.aiScoreContainer}>
                  <View style={[styles.aiScoreBadge, { 
                    backgroundColor: getAIScoreColor(submission.aiAnalysis.score, submission.aiAnalysis.flagged) + '20' 
                  }]}>
                    <IconSymbol 
                      size={16} 
                      name={submission.aiAnalysis.flagged ? 'exclamationmark.triangle.fill' : 'checkmark.circle.fill'} 
                      color={getAIScoreColor(submission.aiAnalysis.score, submission.aiAnalysis.flagged)} 
                    />
                    <ThemedText style={[styles.aiScoreText, { 
                      color: getAIScoreColor(submission.aiAnalysis.score, submission.aiAnalysis.flagged) 
                    }]}>
                      AI Score: {submission.aiAnalysis.score}%
                    </ThemedText>
                  </View>
                  
                  <ThemedText style={styles.confidenceText}>
                    Confidence: {submission.aiAnalysis.confidence}%
                  </ThemedText>
                </View>

                {submission.aiAnalysis.flagged && submission.aiAnalysis.issues && (
                  <View style={styles.issuesContainer}>
                    <ThemedText style={styles.issuesTitle}>⚠️ Issues Detected:</ThemedText>
                    {submission.aiAnalysis.issues.map((issue, index) => (
                      <ThemedText key={index} style={styles.issueText}>• {issue}</ThemedText>
                    ))}
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Pressable 
                  style={[styles.actionBtn, styles.playBtn]}
                  onPress={() => handlePlayVideo(submission.id)}
                >
                  <IconSymbol size={16} name="play.circle.fill" color="#3B82F6" />
                  <ThemedText style={styles.actionBtnText}>Play Video</ThemedText>
                </Pressable>
                
                <Pressable 
                  style={[styles.actionBtn, styles.analysisBtn]}
                  onPress={() => handleViewAnalysis(submission.id)}
                >
                  <IconSymbol size={16} name="chart.line.uptrend.xyaxis" color="#8B5CF6" />
                  <ThemedText style={styles.actionBtnText}>AI Analysis</ThemedText>
                </Pressable>
                
                {submission.status === 'pending' && (
                  <>
                    <Pressable 
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleApprove(submission.id)}
                    >
                      <IconSymbol size={16} name="checkmark" color="#10B981" />
                      <ThemedText style={styles.actionBtnText}>Approve</ThemedText>
                    </Pressable>
                    
                    <Pressable 
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleReject(submission.id)}
                    >
                      <IconSymbol size={16} name="xmark" color="#EF4444" />
                      <ThemedText style={styles.actionBtnText}>Reject</ThemedText>
                    </Pressable>
                  </>
                )}
              </View>

              {submission.reviewedBy && (
                <View style={styles.reviewInfo}>
                  <ThemedText style={styles.reviewText}>
                    Reviewed by: {submission.reviewedBy}
                  </ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* AI Detection Summary */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>🤖 AI Detection Insights</ThemedText>
          
          <View style={styles.insightsGrid}>
            <InsightCard 
              icon="eye.trianglebadge.exclamationmark" 
              title="Cheat Detection" 
              value="94.2%" 
              subtitle="Accuracy rate"
              color="#EF4444" 
            />
            <InsightCard 
              icon="timer" 
              title="Avg Analysis Time" 
              value="2.3s" 
              subtitle="Per video"
              color="#3B82F6" 
            />
            <InsightCard 
              icon="chart.bar.fill" 
              title="Performance Trend" 
              value="+12%" 
              subtitle="This week"
              color="#10B981" 
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function StatsCard({ icon, title, value, color }: { icon: string; title: string; value: string; color: string }) {
  return (
    <View style={styles.statsCard}>
      <View style={[styles.statsIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol size={24} name={icon} color={color} />
      </View>
      <View style={styles.statsContent}>
        <ThemedText type="title" style={styles.statsValue}>{value}</ThemedText>
        <ThemedText style={styles.statsTitle}>{title}</ThemedText>
      </View>
    </View>
  );
}

function InsightCard({ icon, title, value, subtitle, color }: { 
  icon: string; title: string; value: string; subtitle: string; color: string; 
}) {
  return (
    <View style={styles.insightCard}>
      <IconSymbol size={32} name={icon} color={color} />
      <ThemedText type="defaultSemiBold" style={styles.insightValue}>{value}</ThemedText>
      <ThemedText style={styles.insightTitle}>{title}</ThemedText>
      <ThemedText style={styles.insightSubtitle}>{subtitle}</ThemedText>
    </View>
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
    marginBottom: 24,
    paddingBottom: 16,
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
  aiSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  aiText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsTitle: {
    fontSize: 14,
    color: '#6B7280',
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
  submissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  submissionInfo: {
    flex: 1,
  },
  submissionTitle: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  submissionMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  aiAnalysisSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  aiScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  aiScoreText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidenceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  issuesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  issuesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 6,
  },
  issueText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 90,
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  playBtn: {
    backgroundColor: '#EBF4FF',
  },
  analysisBtn: {
    backgroundColor: '#F3E8FF',
  },
  approveBtn: {
    backgroundColor: '#ECFDF5',
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
  },
  reviewInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  reviewText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  insightCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  insightValue: {
    fontSize: 24,
    color: '#1F2937',
  },
  insightTitle: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
  insightSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});