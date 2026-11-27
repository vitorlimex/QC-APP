import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useComandas } from '../context/ComandasContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function CriarComanda() {
  const router = useRouter();
  const leituraRealizada = useRef(false);
  const { comandas } = useComandas();
  const [mesa, setMesa] = useState('');
  const [cameraAberta, setCameraAberta] = useState(false);
  const [permissao, solicitarPermissao] = useCameraPermissions();

  // 🔹 Filtra a digitação: só dígitos, no máximo 2 caracteres
  const handleMesaChange = (texto: string) => {
    const apenasNumeros = texto.replace(/[^0-9]/g, '').slice(0, 2);
    setMesa(apenasNumeros);
  };

  const abrirModal = () => {
    if (!mesa.trim()) {
      alert('Informe o número da mesa!');
      return;
    }

    const numeroMesa = parseInt(mesa, 10);
    if (isNaN(numeroMesa) || numeroMesa < 1 || numeroMesa > 99) {
      alert('O número da mesa deve estar entre 01 e 99!');
      return;
    }

    // 🔹 Padroniza com 2 dígitos ANTES de usar
    const mesaFormatada = String(numeroMesa).padStart(2, '0');

    // 🔹 Normaliza o lado da comanda também, para pegar dados antigos ("7" vs "07")
    const mesaJaOcupada = comandas.some(
      (comanda) =>
        String(parseInt(comanda.mesa, 10)).padStart(2, '0') === mesaFormatada
    );

    if (mesaJaOcupada) {
      alert(`A mesa ${mesaFormatada} já possui uma comanda aberta!`);
      return;
    }

    router.push({
      pathname: '/selecionar_produtos',
      params: { mesa: mesaFormatada },
    });
  };

  async function abrirCamera() {
    // Verifica se a câmera já foi autorizada
    if (!permissao?.granted) {
      const resultado = await solicitarPermissao();

      if (!resultado.granted) {
        alert('Precisamos da permissão da câmera!');
        return;
      }
    }

    leituraRealizada.current = false;
    setCameraAberta(true);
  }

  // Renderização da câmera
  if (cameraAberta) {
    return (
      <View style={styles.containerCamera}>
        <View style={styles.cabecalhoCamera}>
          <Text style={styles.tituloCamera}>Leitor de QR Code</Text>
          <Text style={styles.subtituloCamera}>
            Aponte a câmera para o QR Code da mesa
          </Text>
        </View>

        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={({ data }) => {
            if (leituraRealizada.current) {
              return;
            }

            leituraRealizada.current = true;
            setCameraAberta(false);

            if (!/^\d+$/.test(data)) {
              alert('QR Code inválido! O QR Code deve conter apenas números.');
              return;
            }

            const numeroMesa = parseInt(data, 10);
            if (isNaN(numeroMesa) || numeroMesa < 1 || numeroMesa > 99) {
              alert(
                'QR Code inválido! O número da mesa deve estar entre 01 e 99.'
              );
              return;
            }

            // 🔹 Padroniza com 2 dígitos (ex.: "7" → "07")
            setMesa(String(numeroMesa).padStart(2, '0'));
          }}
        />

        <View style={styles.rodapeCamera}>
          <Pressable
            onPress={() => setCameraAberta(false)}
            style={({ pressed }) => [
              styles.botao,
              styles.botaoPrincipal,
              pressed && styles.botaoPressionado,
            ]}
          >
            <Ionicons name="close-circle-outline" size={22} color="#21170D" />
            <Text style={styles.textoPrincipal}>Fechar Câmera</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.conteudo}>
        <Ionicons name="clipboard-outline" size={52} color="#795024" />

        <Text style={styles.titulo}>Nova Comanda</Text>

        <Text style={styles.subtitulo}>Qual o número da mesa?</Text>

        <TextInput
          placeholder="Ex: 01"
          placeholderTextColor="#795024"
          keyboardType="numeric"
          maxLength={2}
          value={mesa}
          onChangeText={handleMesaChange}
          style={styles.input}
        />

        <View style={styles.botoes}>
          <Pressable
            onPress={abrirCamera}
            style={({ pressed }) => [
              styles.botao,
              styles.botaoSecundario,
              pressed && styles.botaoPressionado,
            ]}
          >
            <Ionicons name="qr-code-outline" size={22} color="#FFFFFF" />
            <Text style={styles.textoSecundario}>Ler QR Code</Text>
          </Pressable>

          <Pressable
            onPress={abrirModal}
            style={({ pressed }) => [
              styles.botao,
              styles.botaoPrincipal,
              pressed && styles.botaoPressionado,
            ]}
          >
            <Ionicons name="list-outline" size={22} color="#21170D" />
            <Text style={styles.textoPrincipal}>Selecionar Produtos</Text>
          </Pressable>

          {/* Botão Voltar */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.botao,
              styles.botaoVoltar,
              pressed && styles.botaoPressionado,
            ]}
          >
            <Ionicons name="arrow-back-outline" size={22} color="#795024" />
            <Text style={styles.textoVoltar}>Voltar para a Lista</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },

  conteudo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 16,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#21170D',
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 16,
    color: '#795024',
    textAlign: 'center',
    marginBottom: 8,
  },

  input: {
    width: '90%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#795024',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#21170D',
  },

  botoes: {
    width: '90%',
    gap: 12,
    marginTop: 10,
  },

  botao: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  botaoPrincipal: {
    backgroundColor: '#D4AF37',
  },

  botaoSecundario: {
    backgroundColor: '#795024',
  },

  botaoVoltar: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#795024',
  },

  textoPrincipal: {
    color: '#21170D',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textoSecundario: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textoVoltar: {
    color: '#795024',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoPressionado: {
    opacity: 0.75,
  },

  // Estilização da tela da câmera

  containerCamera: {
    flex: 1,
    backgroundColor: '#21170D',
  },

  cabecalhoCamera: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },

  tituloCamera: {
    color: '#D4AF37',
    fontSize: 22,
    fontWeight: 'bold',
  },

  subtituloCamera: {
    color: '#FFF8E7',
    fontSize: 14,
    textAlign: 'center',
  },

  camera: {
    flex: 1,
  },

  rodapeCamera: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});