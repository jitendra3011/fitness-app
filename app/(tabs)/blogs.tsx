import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function BlogsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Updates' },
    { id: 'fitness', name: 'Fitness Tips' },
    { id: 'sports', name: 'Sports News' },
    { id: 'health', name: 'Health Benefits' },
    { id: 'nutrition', name: 'Nutrition' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'The Science Behind High-Intensity Interval Training (HIIT)',
      excerpt: 'Discover how HIIT can revolutionize your workout routine, burning more calories in less time while improving cardiovascular health.',
      category: 'fitness',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      author: 'Dr. Sarah Johnson, Fitness Expert'
    },
    {
      id: 2,
      title: 'Mental Health Benefits of Regular Exercise',
      excerpt: 'Research shows that consistent physical activity can significantly reduce stress, anxiety, and depression while boosting overall mental well-being.',
      category: 'health',
      date: '2024-01-12',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop',
      author: 'Dr. Michael Chen, Sports Psychologist'
    },
    {
      id: 3,
      title: 'Nutrition Strategies for Peak Athletic Performance',
      excerpt: 'Learn about the optimal balance of macronutrients and micronutrients that can enhance your athletic performance and recovery.',
      category: 'nutrition',
      date: '2024-01-10',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop',
      author: 'Lisa Rodriguez, Registered Dietitian'
    },
    {
      id: 4,
      title: 'Latest Trends in Sports Technology 2024',
      excerpt: 'From wearable fitness trackers to AI-powered training apps, explore the cutting-edge technology shaping the future of sports.',
      category: 'sports',
      date: '2024-01-08',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      author: 'TechSports Magazine'
    },
    {
      id: 5,
      title: 'Building Strength: The Ultimate Guide to Resistance Training',
      excerpt: 'Master the fundamentals of resistance training to build muscle, increase bone density, and boost your metabolism effectively.',
      category: 'fitness',
      date: '2024-01-05',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      author: 'Coach Mark Thompson, Strength Specialist'
    },
    {
      id: 6,
      title: 'The Role of Sleep in Athletic Recovery',
      excerpt: 'Understanding the critical importance of quality sleep in muscle recovery, performance optimization, and injury prevention.',
      category: 'health',
      date: '2024-01-03',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop',
      author: 'Dr. Emily Watson, Sleep Researcher'
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const renderBlogPost = (post: any) => (
  <TouchableOpacity
    key={post.id} // ✅ Add key here
    style={styles.blogCard}
    onPress={() => router.push({ pathname: '/blog-detail/[id]', params: { id: post.id.toString() } })}
  >
    <Image source={{ uri: post.image }} style={styles.blogImage} />
    <View style={styles.blogContent}>
      <View style={styles.blogHeader}>
        <Text style={styles.category}>{categories.find(cat => cat.id === post.category)?.name}</Text>
        <Text style={styles.date}>{post.date} • {post.readTime}</Text>
      </View>
      <Text style={styles.blogTitle}>{post.title}</Text>
      <Text style={styles.blogExcerpt}>{post.excerpt}</Text>
      <Text style={styles.author}>By {post.author}</Text>
    </View>
  </TouchableOpacity>
);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Latest Updates</Text>
        <Text style={styles.subtitle}>Stay informed with the latest in fitness, health, and sports</Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, selectedCategory === category.id && styles.activeCategoryButton]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[styles.categoryButtonText, selectedCategory === category.id && styles.activeCategoryButtonText]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Blog Posts */}
      <View style={styles.blogsContainer}>
        {filteredPosts.map(renderBlogPost)}
      </View>

      {/* Newsletter Signup */}
      <View style={styles.newsletterSection}>
        <Text style={styles.newsletterTitle}>Stay Updated</Text>
        <Text style={styles.newsletterSubtitle}>Get the latest fitness insights delivered to your inbox</Text>
        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeButtonText}>Subscribe to Newsletter</Text>
        </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 22,
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  activeCategoryButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  activeCategoryButtonText: {
    color: '#ffffff',
  },
  blogsContainer: {
    padding: 20,
  },
  blogCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  blogImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  blogContent: {
    padding: 16,
  },
  blogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007bff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 12,
    color: '#6c757d',
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    lineHeight: 24,
  },
  blogExcerpt: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  author: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  newsletterSection: {
    backgroundColor: '#007bff',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  newsletterSubtitle: {
    fontSize: 14,
    color: '#e3f2fd',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
});
