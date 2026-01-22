import React from 'react';
import { Text, View } from 'react-native';

type StepIndicatorProps = {
    currentStep: number;
    totalSteps?: number;
};

export default function StepIndicator({ currentStep, totalSteps = 3 }: StepIndicatorProps) {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
    
    return (
        <View className="flex-row justify-center items-center mb-6 px-4">
            {steps.map((step) => (
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
                    {step < totalSteps && (
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
}

type StepTitleProps = {
    currentStep: number;
};

const TITLES = ['Personal Details', 'Delivery Address', 'Payment Details'];
const SUBTITLES = [
    "Let's get to know you",
    'Where should we deliver?',
    'Secure your payment method'
];

export function StepTitle({ currentStep }: StepTitleProps) {
    return (
        <View className="items-center mb-6">
            <Text className="text-xl font-bold text-orange-600">{TITLES[currentStep - 1]}</Text>
            <Text className="text-gray-500 text-sm mt-1">{SUBTITLES[currentStep - 1]}</Text>
        </View>
    );
}
