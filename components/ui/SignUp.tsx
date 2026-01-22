import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Step Components
import DeliveryAddressStep from '@/components/signup/DeliveryAddressStep';
import PaymentDetailsStep from '@/components/signup/PaymentDetailsStep';
import PersonalDetailsStep from '@/components/signup/PersonalDetailsStep';
import StepIndicator, { StepTitle } from '@/components/signup/StepIndicator';

export default function SignUpForm() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { signup, loading } = useAuth();

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
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return false;
            }
            return true;
        }
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

        if (result) {
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
                    <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

                    {/* Step Title */}
                    <StepTitle currentStep={currentStep} />

                    {/* Render Current Step */}
                    {currentStep === 1 && (
                        <PersonalDetailsStep
                            name={name}
                            setName={setName}
                            surname={surname}
                            setSurname={setSurname}
                            contactNumber={contactNumber}
                            setContactNumber={setContactNumber}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            loading={loading}
                        />
                    )}
                    {currentStep === 2 && (
                        <DeliveryAddressStep
                            streetAddress={streetAddress}
                            setStreetAddress={setStreetAddress}
                            city={city}
                            setCity={setCity}
                            province={province}
                            setProvince={setProvince}
                            postalCode={postalCode}
                            setPostalCode={setPostalCode}
                            loading={loading}
                        />
                    )}
                    {currentStep === 3 && (
                        <PaymentDetailsStep
                            cardNumber={cardNumber}
                            setCardNumber={setCardNumber}
                            cardName={cardName}
                            setCardName={setCardName}
                            expiryDate={expiryDate}
                            setExpiryDate={setExpiryDate}
                            cvv={cvv}
                            setCvv={setCvv}
                            loading={loading}
                            formatCardNumber={formatCardNumber}
                            formatExpiryDate={formatExpiryDate}
                        />
                    )}

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