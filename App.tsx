/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation';
import { amplifyConfig } from './src/api/awsConfig';
import { Amplify } from 'aws-amplify';
import { UserProvider } from './src/context/UserContext';
import Toast from 'react-native-toast-message';

Amplify.configure(amplifyConfig);

function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <RootNavigator />
        <Toast />
      </UserProvider>
    </SafeAreaProvider>
  );
}

export default App;
