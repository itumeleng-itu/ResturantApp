// app/index.tsx - SUPABASE CONNECTION TEST
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { supabase } from '../lib/supabase'

export default function TestScreen() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [testResults, setTestResults] = useState({
    connection: null as string | null,
    categoriesCount: null as number | null,
    itemsCount: null as number | null,
    auth: null as string | null
  })

  // Test 1: Basic Connection
  const testConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
      
      if (error) throw error
      
      setCategories(data || [])
      setTestResults(prev => ({
        ...prev,
        connection: '✅ Connected!',
        categoriesCount: data?.length || 0
      }))
      Alert.alert('Success!', `Found ${data?.length || 0} categories`)
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        connection: '❌ Failed: ' + error.message
      }))
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  // Test 2: Get Menu Items
  const testMenuItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .limit(10)
      
      if (error) throw error
      
      setMenuItems(data || [])
      setTestResults(prev => ({
        ...prev,
        itemsCount: data?.length || 0
      }))
      Alert.alert('Success!', `Found ${data?.length || 0} menu items`)
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  // Test 3: Authentication
  const testSignup = async () => {
    setLoading(true)
    try {
      const testEmail = `test${Date.now()}@example.com`
      const testPassword = 'Test123456'
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: 'Test',
            surname: 'User',
            contact_number: '0123456789'
          }
        }
      })
      
      if (error) throw error
      
      setTestResults(prev => ({
        ...prev,
        auth: '✅ Signup works!'
      }))
      Alert.alert('Success!', 'Test user created: ' + testEmail)
      
      // Auto logout after test
      await supabase.auth.signOut()
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        auth: '❌ Failed: ' + error.message
      }))
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  // Test 4: Get Item with Relations
  const testRelations = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(name),
          side_options(*),
          drink_options(*),
          extras(*)
        `)
        .limit(1)
        .single()
      
      if (error) throw error
      
      Alert.alert(
        'Success!', 
        `Item: ${data.name}\n` +
        `Category: ${data.category?.name}\n` +
        `Sides: ${data.side_options?.length || 0}\n` +
        `Drinks: ${data.drink_options?.length || 0}\n` +
        `Extras: ${data.extras?.length || 0}`
      )
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>🧪 Supabase Connection Test</Text>
        
        {/* Test Results */}
        <View style={styles.resultsBox}>
          <Text style={styles.resultText}>
            Connection: {testResults.connection || '⏳ Not tested'}
          </Text>
          <Text style={styles.resultText}>
            Categories Found: {testResults.categoriesCount ?? 'N/A'}
          </Text>
          <Text style={styles.resultText}>
            Menu Items: {testResults.itemsCount ?? 'N/A'}
          </Text>
          <Text style={styles.resultText}>
            Auth Test: {testResults.auth || '⏳ Not tested'}
          </Text>
        </View>

        {/* Test Buttons */}
        <TouchableOpacity 
          style={styles.button}
          onPress={testConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            1️⃣ Test Connection (Get Categories)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={testMenuItems}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            2️⃣ Test Menu Items
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={testRelations}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            3️⃣ Test Relations (JOIN)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.authButton]}
          onPress={testSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            4️⃣ Test Authentication
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
        )}

        {/* Display Categories */}
        {categories.length > 0 && (
          <View style={styles.dataBox}>
            <Text style={styles.dataTitle}>📂 Categories:</Text>
            {categories.map((cat) => (
              <Text key={cat.id} style={styles.dataItem}>
                • {cat.name}
              </Text>
            ))}
          </View>
        )}

        {/* Display Menu Items */}
        {menuItems.length > 0 && (
          <View style={styles.dataBox}>
            <Text style={styles.dataTitle}>🍔 Menu Items:</Text>
            {menuItems.map((item) => (
              <Text key={item.id} style={styles.dataItem}>
                • {item.name} - R{item.price}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>📝 Instructions:</Text>
          <Text style={styles.instructionText}>
            1. Make sure you updated lib/supabase.ts with YOUR credentials
          </Text>
          <Text style={styles.instructionText}>
            2. Run tests in order (1 → 2 → 3 → 4)
          </Text>
          <Text style={styles.instructionText}>
            3. Check console for detailed logs
          </Text>
          <Text style={styles.instructionText}>
            4. If all tests pass ✅, Supabase is working!
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2D3142',
  },
  resultsBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#2D3142',
  },
  button: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  authButton: {
    backgroundColor: '#4ECDC4',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  dataBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2D3142',
  },
  dataItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  instructions: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  instructionText: {
    fontSize: 13,
    marginBottom: 5,
    color: '#2D3142',
  },
})