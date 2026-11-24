import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import {KeyboardAvoidingView,Platform,Pressable,Text,TextInput,View,} from 'react-native';
import { useComandas } from '../context/ComandasContext';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CriarComanda() {
  const router = useRouter();
  const leituraRealizada = useRef(false);
  const { comandas } = useComandas();
  const [mesa, setMesa] = useState('');
  const [cameraAberta, setCameraAberta] = useState(false); //abre a camera e fecha camera
  const [permissao, solicitarPermissao] = useCameraPermissions(); // verifica se autorizou a utilização da camera

  const abrirModal = () => {
    if (!mesa.trim()) {
      alert('Informe o número da mesa!');
      return;
    }
    
    const mesaJaOcupada = comandas.some(
      (comanda) => comanda.mesa === mesa.trim()
    );

    if (mesaJaOcupada) {
      alert(`A mesa ${mesa} já possui uma comanda aberta!`);
      return;
    }

    router.push({ pathname: '/selecionar_produtos', params: { mesa: mesa.trim() } });
  };

  async function abrirCamera() {
      if (!permissao?.granted) { //verifica se a camera já foi autorizada
        const resultado = await solicitarPermissao(); // solicita permissão do usuario


        if (!resultado.granted) {
          alert("Precisamos da permissão da câmera!");
          return;
        }
      }

      leituraRealizada.current = false;
      setCameraAberta(true); //indica que quer abrir a camera
    }

  if (cameraAberta) { //verifica se o funcionario pediu para abrir a câmera
  return (
    <View style={{ flex: 1 }}>
      <CameraView // mostra a câmera do iphone
        style={{ flex: 1 }}
        facing="back" //utiliza a câmera traseira
        barcodeScannerSettings={{
          barcodeTypes: ["qr"], //configura a leitura de QRCodes
        }}
        onBarcodeScanned={({ data }) => {
          if (leituraRealizada.current) {
            return;
          }

          leituraRealizada.current = true;
          
           setCameraAberta(false);
          
          if (!/^\d+$/.test(data)) {
            alert("QR Code inválido! Informe um número de mesa.");
              return;
           }

          setMesa(data);
          }} 
      />

      <Pressable
        onPress={() => setCameraAberta(false)} //fecha a câmera e retorna pra tela de nova comanda
        style={{
          backgroundColor: "#D4AF37",
          padding: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#000", fontWeight: "bold" }}>
          Fechar Câmera
        </Text>
      </Pressable>
    </View>
  );
}

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',   // ⬅️ centraliza verticalmente
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Qual o número da mesa?
        </Text>

        <TextInput
          placeholder="Ex: 01"
          keyboardType="numeric"
          value={mesa}
          onChangeText={setMesa}
          style={{
            borderWidth: 1,
            padding: 15,
            fontSize: 18,
            marginBottom: 20,
            borderRadius: 8,
          }}
        />

       <Pressable
        onPress={abrirCamera}
        style={{
        backgroundColor: "#D4AF37",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12,
        }}
        >
        <Text style={{ color: "#000", fontWeight: "bold" }}>
          Ler QR Code
        </Text>
      </Pressable>

        <Pressable
          onPress={abrirModal}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#005fcc' : '#007AFF',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 12,
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Selecionar Produtos
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#555' : '#888',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Voltar para a Lista
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}