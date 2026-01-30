import { ExtraOption, SelectedExtra } from '@/types/customization';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type ExtraSelectionProps = {
    options: ExtraOption[];
    selectedExtras: SelectedExtra[];
    onToggle: (extra: ExtraOption) => void;
    onUpdateQuantity: (extraId: string, change: number) => void;
};

export const ExtraSelection = ({ options, selectedExtras, onToggle, onUpdateQuantity }: ExtraSelectionProps) => {
    if (options.length === 0) return null;

    return (
        <View className="mt-6 mb-3">
             <View className="mb-3">
                <Text className="text-white text-lg font-bold">Add Extras</Text>
                <Text className="text-gray-400 text-sm mt-1">Additional charges apply</Text>
            </View>
            <View className="gap-2">
                {options.map((extra) => {
                    const selected = selectedExtras.find(e => e.extra.id === extra.id);
                    return (
                        <View 
                            key={extra.id}
                            className={`flex-row items-center justify-between p-4 rounded-xl border ${
                                selected ? 'bg-gray-800 border-orange-500' : 'bg-gray-800 border-gray-700'
                            }`}
                        >
                            <TouchableOpacity 
                                onPress={() => onToggle(extra)}
                                className="flex-1 flex-row items-center"
                            >
                                <View className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${
                                    selected ? 'bg-orange-500 border-orange-500' : 'border-gray-600'
                                }`}>
                                    {selected && <MaterialIcons name="check" size={16} color="white" />}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-medium">{extra.name}</Text>
                                    <Text className="text-orange-500 text-sm">+R{extra.price.toFixed(2)}</Text>
                                </View>
                            </TouchableOpacity>
                            {selected && (
                                <View className="flex-row items-center gap-3">
                                    <TouchableOpacity 
                                        onPress={() => onUpdateQuantity(extra.id, -1)}
                                        className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                    >
                                        <MaterialIcons name="remove" size={18} color="white" />
                                    </TouchableOpacity>
                                    <Text className="text-white font-bold w-6 text-center">{selected.quantity}</Text>
                                    <TouchableOpacity 
                                        onPress={() => onUpdateQuantity(extra.id, 1)}
                                        className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center"
                                    >
                                        <MaterialIcons name="add" size={18} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
