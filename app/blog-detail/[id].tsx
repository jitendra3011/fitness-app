import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Pressable } from 'react-native';
import { X } from 'lucide-react-native';

const blogPosts = [
  {
    id: 1,
    title: 'The Science Behind High-Intensity Interval Training (HIIT)',
    content: 'Discover how HIIT can revolutionize your workout routine, burning more calories in less time while improving cardiovascular health. HIIT involves short bursts of intense exercise alternated with recovery periods. This method not only maximizes calorie burn during the workout but also boosts your metabolism for hours afterward through a phenomenon known as excess post-exercise oxygen consumption (EPOC). Research shows that HIIT can improve insulin sensitivity, reduce blood pressure, and enhance aerobic capacity more effectively than traditional steady-state cardio. Moreover, HIIT workouts are typically shorter, making them ideal for busy schedules. Whether you\'re a beginner or an experienced athlete, incorporating HIIT into your routine can lead to significant improvements in overall fitness and health.',
    advantages: [
      'Efficient calorie burning in less time',
      'Improves cardiovascular health',
      'Boosts metabolism post-exercise',
      'Enhances insulin sensitivity',
      'Suitable for all fitness levels',
      'Builds mental toughness & focus',
      'Adds variety — no boring routines'
    ],
    category: 'fitness',
    date: '2024-01-15',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=350&fit=crop',
    author: 'Dr. Sarah Johnson, Fitness Expert'
  },
  {
    id: 2,
    title: 'Mental Health Benefits of Regular Exercise',
    content: 'Research shows that consistent physical activity can significantly reduce stress, anxiety, and depression while boosting overall mental well-being. Exercise releases endorphins, often called "feel-good" hormones, which naturally improve mood and reduce feelings of pain. Regular physical activity has been shown to increase the production of neurotransmitters like serotonin and norepinephrine, which play crucial roles in regulating mood. Additionally, exercise can improve sleep quality, which is essential for mental health. Studies have found that even moderate exercise, such as a daily 30-minute walk, can have profound effects on reducing symptoms of depression and anxiety. Furthermore, engaging in physical activity can provide a sense of accomplishment and social interaction, further enhancing mental well-being. Whether through team sports, individual workouts, or group fitness classes, exercise offers a powerful tool for maintaining and improving mental health.',
    advantages: [
      'Reduces stress and anxiety',
      'Boosts mood through endorphin release',
      'Improves sleep quality',
      'Enhances cognitive function',
      'Provides social interaction opportunities'
    ],
    category: 'health',
    date: '2024-01-12',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=350&fit=crop',
    author: 'Dr. Michael Chen, Sports Psychologist'
  },
  {
    id: 3,
    title: 'Nutrition Strategies for Peak Athletic Performance',
    content: 'Learn about the optimal balance of macronutrients and micronutrients that can enhance your athletic performance and recovery. Proper nutrition is the foundation of athletic success, providing the fuel needed for intense training and competition. Carbohydrates serve as the primary energy source for high-intensity activities, while proteins are essential for muscle repair and growth. Healthy fats support hormone production and provide sustained energy. Timing of nutrient intake is also crucial, with pre-workout meals focusing on easily digestible carbs and post-workout nutrition emphasizing protein and carbs for recovery. Hydration plays a vital role, with athletes needing to maintain proper electrolyte balance. Micronutrients like iron, calcium, and vitamin D are important for overall health and performance. By understanding and implementing proper nutrition strategies, athletes can optimize their training, enhance recovery, and achieve peak performance.',
    advantages: [
      'Optimizes energy levels',
      'Supports muscle repair and growth',
      'Enhances recovery',
      'Maintains electrolyte balance',
      'Improves overall health and performance'
    ],
    category: 'nutrition',
    date: '2024-01-10',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=350&fit=crop',
    author: 'Lisa Rodriguez, Registered Dietitian'
  },
  {
    id: 4,
    title: 'Latest Trends in Sports Technology 2024',
    content: 'From wearable fitness trackers to AI-powered training apps, explore the cutting-edge technology shaping the future of sports. The sports technology landscape is rapidly evolving, with innovations that are transforming how athletes train, compete, and recover. Wearable devices now offer advanced metrics like heart rate variability, sleep quality, and even blood oxygen levels. GPS tracking has become more precise, allowing for detailed analysis of movement patterns and performance. AI and machine learning are being integrated into training programs, providing personalized workout recommendations and injury prevention insights. Virtual reality is emerging as a tool for mental training and skill development. Smart equipment, such as connected weights and bikes, provides real-time feedback on form and technique. As technology continues to advance, athletes and coaches have access to unprecedented data and tools to optimize performance and reduce injury risk.',
    advantages: [
      'Provides detailed performance metrics',
      'Enables personalized training',
      'Helps prevent injuries',
      'Enhances mental training',
      'Offers real-time feedback'
    ],
    category: 'sports',
    date: '2024-01-08',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=350&fit=crop',
    author: 'TechSports Magazine'
  },
  {
    id: 5,
    title: 'Building Strength: The Ultimate Guide to Resistance Training',
    content: 'Master the fundamentals of resistance training to build muscle, increase bone density, and boost your metabolism effectively. Resistance training, also known as strength training, is a cornerstone of any comprehensive fitness program. It involves working against an external force to build strength, endurance, and muscle mass. The benefits extend beyond aesthetics, including improved bone density, enhanced metabolism, and better functional movement. Proper form is crucial to prevent injury and maximize results. Progressive overload, gradually increasing the demands on your muscles, is key to continued improvement. Compound exercises like squats, deadlifts, and bench presses work multiple muscle groups simultaneously. Recovery is equally important, with adequate rest and nutrition supporting muscle growth. Whether using free weights, machines, or bodyweight exercises, resistance training offers a versatile and effective way to transform your physique and health.',
    advantages: [
      'Builds muscle mass and strength',
      'Increases bone density',
      'Boosts metabolism',
      'Improves functional movement',
      'Enhances overall physique'
    ],
    category: 'fitness',
    date: '2024-01-05',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=350&fit=crop',
    author: 'Coach Mark Thompson, Strength Specialist'
  },
  {
    id: 6,
    title: 'The Role of Sleep in Athletic Recovery',
    content: 'Understanding the critical importance of quality sleep in muscle recovery, performance optimization, and injury prevention. Sleep is often overlooked but is absolutely essential for athletic performance and recovery. During sleep, the body undergoes crucial repair processes, including muscle tissue repair and growth hormone release. Quality sleep enhances cognitive function, reaction time, and decision-making skills vital for sports performance. Chronic sleep deprivation can lead to decreased immune function, increased injury risk, and impaired recovery. Athletes should aim for 7-9 hours of quality sleep per night, maintaining consistent sleep schedules. Creating an optimal sleep environment, including cool, dark rooms and limiting screen time before bed, can improve sleep quality. Recovery strategies like naps and sleep extension can be particularly beneficial for athletes with demanding training schedules. Prioritizing sleep is not a luxury but a necessity for optimal athletic performance and long-term health.',
    advantages: [
      'Promotes muscle repair and growth',
      'Enhances cognitive function',
      'Reduces injury risk',
      'Improves immune function',
      'Optimizes athletic performance'
    ],
    category: 'health',
    date: '2024-01-03',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=350&fit=crop',
    author: 'Dr. Emily Watson, Sleep Researcher'
  }
];

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const post = blogPosts.find(p => p.id === parseInt(id as string));

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Blog post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Blog Detail</Text>
      </View>

      <View style={styles.content}>
        <Image source={{ uri: post.image }} style={styles.image} />
        <View style={styles.meta}>
          <Text style={styles.category}>{post.category.toUpperCase()}</Text>
          <Text style={styles.date}>{post.date} • {post.readTime}</Text>
        </View>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.contentText}>{post.content}</Text>

        <View style={styles.advantagesSection}>
          <Text style={styles.advantagesTitle}>Advantages</Text>
          {post.advantages && post.advantages.map((adv, index) => (
            <Text key={index} style={styles.advantageItem}>• {adv}</Text>
          ))}
        </View>

        <Text style={styles.author}>By {post.author}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
  },
  content: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 12,
    marginBottom: 20,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007bff',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 12,
    color: '#6c757d',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
    lineHeight: 36,
  },
  contentText: {
    fontSize: 18,
    color: '#495057',
    lineHeight: 28,
    marginBottom: 24,
  },
  advantagesSection: {
    marginBottom: 24,
  },
  advantagesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12,
  },
  advantageItem: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
  },
});
