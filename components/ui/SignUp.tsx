import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignUpForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signup, loading, error } = useAuth();

  // Pagination state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Personal Details
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Address Details
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!name || !surname || !email || !contactNumber || !password || !confirmPassword) {
        alert('Please fill all required fields');
        return false;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
      }
      if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return false;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
      }
      return true;
    }
    // Step 2 (Address) and Step 3 (Payment) are optional
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSignUp = async () => {
    if (!validateStep(currentStep)) return;

    const formattedCardNumber = cardNumber.replace(/\s/g, '');

    const result = await signup(email, password, {
      name,
      surname,
      contact_number: contactNumber,
      address: {
        street: streetAddress,
        city,
        province,
        postal_code: postalCode
      },
      card_details: {
        card_number: formattedCardNumber,
        card_name: cardName,
        expiry_date: expiryDate
      }
    });

    if(result){
      router.replace('/SignIn');
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted.slice(0, 19));
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\//g, '');
    if (cleaned.length >= 2) {
      setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4));
    } else {
      setExpiryDate(cleaned);
    }
  };

  const renderStepIndicator = () => (
    <View className="flex-row justify-center items-center mb-6 px-4">
      {[1, 2, 3].map((step) => (
        <View key={step} className="flex-row items-center">
          <View 
            className={`w-10 h-10 rounded-full items-center justify-center ${
              step === currentStep 
                ? 'bg-orange-600' 
                : step < currentStep 
                  ? 'bg-orange-400' 
                  : 'bg-gray-200'
            }`}
          >
            <Text className={`font-bold ${step <= currentStep ? 'text-white' : 'text-gray-400'}`}>
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View 
              className={`w-16 h-1 mx-1 ${
                step < currentStep ? 'bg-orange-400' : 'bg-gray-200'
              }`} 
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStepTitle = () => {
    const titles = ['Personal Details', 'Delivery Address', 'Payment Details'];
    const subtitles = [
      'Let\'s get to know you',
      'Where should we deliver?',
      'Secure your payment method'
    ];
    
    return (
      <View className="items-center mb-6">
        <Text className="text-xl font-bold text-orange-600">{titles[currentStep - 1]}</Text>
        <Text className="text-gray-500 text-sm mt-1">{subtitles[currentStep - 1]}</Text>
      </View>
    );
  };

  const renderStep1 = () => (
    <View className="w-full">
      {/* Name */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
          Name <Text className="text-orange-600">*</Text>
        </Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="John"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />
      </View>

      {/* Surname */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
          Surname <Text className="text-orange-600">*</Text>
        </Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="Doe"
          placeholderTextColor="#9CA3AF"
          value={surname}
          onChangeText={setSurname}
          editable={!loading}
        />
      </View>

      {/* Contact Number */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
          Contact Number <Text className="text-orange-600">*</Text>
        </Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="0712345678"
          placeholderTextColor="#9CA3AF"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
          maxLength={10}
          editable={!loading}
        />
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
          Email <Text className="text-orange-600">*</Text>
        </Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="john@example.com"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      {/* Password */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
          Password <Text className="text-orange-600">*</Text>
        </Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
      </View>

      {/* Confirm Password */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
          Confirm Password <Text className="text-orange-600">*</Text>
        </Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="w-full">
      {/* Street Address */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Street Address</Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="123 Main Street"
          placeholderTextColor="#9CA3AF"
          value={streetAddress}
          onChangeText={setStreetAddress}
          editable={!loading}
        />
      </View>

      {/* City */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">City</Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="Polokwane"
          placeholderTextColor="#9CA3AF"
          value={city}
          onChangeText={setCity}
          editable={!loading}
        />
      </View>

      {/* Province & Postal Code Row */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Province</Text>
          <TextInput
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
            placeholder="Limpopo"
            placeholderTextColor="#9CA3AF"
            value={province}
            onChangeText={setProvince}
            editable={!loading}
          />
        </View>
        
        <View className="flex-1">
          <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Postal Code</Text>
          <TextInput
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
            placeholder="0700"
            placeholderTextColor="#9CA3AF"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
            maxLength={4}
            editable={!loading}
          />
        </View>
      </View>

      <Text className="text-gray-400 text-xs italic">
        You can add or update your address later in settings
      </Text>
    </View>
  );

  const renderStep3 = () => (
    <View className="w-full">
      <Text className="text-gray-400 text-xs mb-3 italic">
        Test cards: 4242 4242 4242 4242 (Visa) • 5555 5555 5555 4444 (Mastercard)
      </Text>
      
      {/* Card Number */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Card Number</Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="4242 4242 4242 4242"
          placeholderTextColor="#9CA3AF"
          value={cardNumber}
          onChangeText={formatCardNumber}
          keyboardType="numeric"
          maxLength={19}
          editable={!loading}
        />
      </View>

      {/* Cardholder Name */}
      <View className="mb-4">
        <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Cardholder Name</Text>
        <TextInput
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
          placeholder="JOHN DOE"
          placeholderTextColor="#9CA3AF"
          value={cardName}
          onChangeText={setCardName}
          autoCapitalize="characters"
          editable={!loading}
        />
      </View>

      {/* Expiry Date & CVV Row */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Expiry Date</Text>
          <TextInput
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
            placeholder="MM/YY"
            placeholderTextColor="#9CA3AF"
            value={expiryDate}
            onChangeText={formatExpiryDate}
            keyboardType="numeric"
            maxLength={5}
            editable={!loading}
          />
        </View>
        
        <View className="flex-1">
          <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">CVV</Text>
          <TextInput
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
            placeholder="123"
            placeholderTextColor="#9CA3AF"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
            editable={!loading}
          />
        </View>
      </View>

      <Text className="text-gray-400 text-xs italic">
        You can add or update your payment method later in settings
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center px-8 pt-1 pb-10">
          {/* Logo & Tagline */}
          <View className="items-center mb-4">
            <Text className="text-3xl font-bold text-orange-600">the eatery</Text>
            <Text className="text-gray-400 text-base mt-1">deliciousness delivered fast</Text>
          </View>

          {/* Animation - Only show on first step */}
          {currentStep === 1 && (
            <View style={{ width: 300, height: 200 }}>
              <LottieView
                source={require('../../assets/animations/fastfood.json')}
                autoPlay
                loop
                style={{ width: 300, height: 250 }}
              />
            </View>
          )}

          <Text className="text-black/80 italic font-semibold text-md mt-4 mb-6">
            Create your account
          </Text>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Title */}
          {renderStepTitle()}

          {/* Render Current Step */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <View className="w-full mt-6 gap-3">
            {currentStep < totalSteps ? (
              <View className="flex-row gap-3">
                {currentStep > 1 && (
                  <TouchableOpacity 
                    className="flex-1 h-14 bg-gray-200 rounded-full items-center justify-center"
                    onPress={handleBack}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    <Text className="text-gray-700 text-base font-semibold">Back</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  className={`${currentStep > 1 ? 'flex-1' : 'w-full'} h-14 bg-orange-600 rounded-full items-center justify-center`}
                  onPress={handleNext}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <Text className="text-white text-base font-semibold">Next</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row gap-3">
                <TouchableOpacity 
                  className="flex-1 h-14 bg-gray-200 rounded-full items-center justify-center"
                  onPress={handleBack}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <Text className="text-gray-700 text-base font-semibold">Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="flex-1 h-14 bg-orange-600 rounded-full items-center justify-center"
                  onPress={handleSignUp}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-white text-base font-semibold">Create Account</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Login Link */}
          <View className="flex-row items-center mt-6">
            <Text className="text-gray-500 text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()} disabled={loading}>
              <Text className="text-orange-600 text-sm font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}