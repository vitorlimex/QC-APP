// src/app/criar_comanda.tsx
import { useRouter } from 'expo-router';
import { Button, Text, TextInput, View } from 'react-native';

export default function CriarComanda() {
  const router = useRouter(); 

  return (
    <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 20 }}>
      
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Qual o número da mesa?
      </Text>

      <TextInput
        placeholder="Ex: 01"
        keyboardType="numeric" 
        style={{ 
          borderWidth: 1, 
          padding: 15, 
          fontSize: 18, 
          marginBottom: 20,
          borderRadius: 8
        }}
      />
      
      <Button 
        title="Voltar para a Lista" 
        onPress={() => router.back()} // Volta para a tela anterior
      />

    </View>
  );
}