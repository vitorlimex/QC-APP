import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';


export default function TelaCadastro() {
    const [nome, setNome] = useState('')
    const [email, setEmail] =useState('')
    const [senha, setSenha] =useState('')
    const [confirmarSenha, setConfirmarSenha] =useState('')

    // verifica se todos os campos foram preenchidos e se as senhas são iguais
    function handleCadastro() {
         if (!nome || !email || !senha || !confirmarSenha) {
            alert('Preencha todos os campos!');
            return;
        }
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
    return;
    }
    alert('Senhas iguais!');
    }

 


    return (
        <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12
    }}>
            <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: '#222',
                marginBottom: 8
                }}>
                Criar conta
                 </Text>
                
                <Text style={{
                    fontSize: 14,
                    color: '#777',
                    marginBottom: 15
                }}>
                    Preencha seus dados para começar
                    </Text>


            <TextInput
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                style={{ borderWidth: 2, width: '90%', padding: 10 }}
                placeholderTextColor="#777"
            />

            <TextInput
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize="none"
            style={{ borderWidth: 2, width: '90%', padding: 10 }}
            placeholderTextColor="#777"
            />

            <TextInput 
            placeholder='Senha'
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
            style={{ borderWidth: 2, width: '90%', padding: 10 }}
            placeholderTextColor="#777"
            />

            <TextInput
            placeholder='Confirmar senha'
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={true}
            style={{ borderWidth: 2, width: '90%', padding: 10 }}
            placeholderTextColor="#777"
            />
            
            <Button title='Cadastrar' onPress={handleCadastro} />


        </View>

    );
}


