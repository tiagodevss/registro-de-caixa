import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './Firebase-config';
import { Icon } from 'react-native-elements';
import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';
import NovoRegistro from './src/pages/NovoRegistro';
import Registros from './src/pages/Registros';
import { useFonts, Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VerRegistro from './src/pages/VerRegistro';
import { Alert } from 'react-native';


export default props => {
  const [user, setUser] = useState()

  async function getUser() {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
    });
  }

  useEffect(() => {
    getUser();
  }, [])

  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black
  });

  if (!fontsLoaded) {
    return null;
  }

  const Tab = createBottomTabNavigator();
  const RegistrosStack = createNativeStackNavigator();

  function RegistrosScreens() {
    return (
      <RegistrosStack.Navigator >
        <RegistrosStack.Screen
          name="Registro"
          component={Registros}
          options={{
            headerStyle: { backgroundColor: "#1E90FF" },
            headerTitleAlign: "center",
            color: "#fff",
            headerTitleStyle: { color: "#fff" }
          }}
        />
        <RegistrosStack.Screen
          name="Ver Registro"
          component={VerRegistro}
          options={{
            headerLeftContainerStyle: { backgroundColor: '#fff', color: '#fff' },
            headerStyle: { backgroundColor: "#1E90FF" },
            headerTitleAlign: "center",
            headerTitleStyle: { color: "#fff" },
            headerTintColor: "#fff",
          }}
        />
      </RegistrosStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        {
          user ?
            <>
              <Tab.Screen
                options={{
                  tabBarIcon: ({ focused }) => <Icon name='home' type='font-awesome' color={focused ? '#1E90FF' : "#B0C4DE"} />,
                  headerStyle: { backgroundColor: "#1E90FF" },
                  headerTintColor: "#fff",
                  headerTitleAlign: 'center',
                  headerLeft: () => {
                    return (
                      <Icon name='logout' type='material' color={'white'} onPress={() => {
                        Alert.alert("Deseja sair da conta?", "Você pode fazer login novamente mais tarde.", [{
                          text: "Sim, quero sair.",
                          onPress: async () => await signOut(auth)
                        }, {
                          text: "Não",
                        }])
                      }}/>
                    )
                  },
                  headerLeftContainerStyle: { left: 15 },
                }}
                name="Dashboard"
                component={Dashboard}
              />
              <Tab.Screen
                options={{
                  tabBarIcon: ({ focused }) => <Icon name='plus' type='font-awesome' color={focused ? '#1E90FF' : "#B0C4DE"} />,
                  headerStyle: { backgroundColor: "#1E90FF" },
                  headerTintColor: "#fff",
                  headerTitleAlign: 'center',
                }}
                name="Novo Registro"
                component={NovoRegistro}
              />
              <Tab.Screen
                options={{
                  tabBarIcon: ({ focused }) => <Icon name='clipboard' type='font-awesome' color={focused ? '#1E90FF' : "#B0C4DE"} />,
                  headerShown: false,
                  headerTintColor: "#fff",
                  headerTitleAlign: 'center',
                }}
                name="Registros"
                component={RegistrosScreens}
              />
            </>
            :
            <>
              <Tab.Screen
                options={{ headerShown: false, tabBarStyle: { display: "none" } }}
                name="Login"
                component={Login}
              />
            </>
        }
      </Tab.Navigator>
    </NavigationContainer>
  );
}