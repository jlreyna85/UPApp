<<<<<<< HEAD
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type RadioButtonGroupProps = {
  title: string;
  options: string[];
  onValueChange: (value: number) => void;
};

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ title, options, onValueChange }) => {
  const handlePress = (index: number) => {
    onValueChange(index); // Se asigna el valor basado en el índice
  };

  return (
    <View>
      <Text>{title}</Text>
      {options.map((option, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(index)}>
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButtonGroup;
=======
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type RadioButtonGroupProps = {
  title: string;
  options: string[];
  onValueChange: (value: number) => void;
};

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ title, options, onValueChange }) => {
  const handlePress = (index: number) => {
    onValueChange(index); // Se asigna el valor basado en el índice
  };

  return (
    <View>
      <Text>{title}</Text>
      {options.map((option, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(index)}>
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButtonGroup;
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
