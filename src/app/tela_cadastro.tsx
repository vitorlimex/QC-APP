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
        <View>
            <Text>Cadastro</Text>

            <TextInput
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize="none"
            />

            <TextInput 
            placeholder='Senha'
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
            />

            <TextInput
            placeholder='Confirmar senha'
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={true}
            />
            
            <Button title='Cadastrar' onPress={handleCadastro} />


        </View>

    );
}


