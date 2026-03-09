import {
  View,
  TextInput,
  TouchableOpacity,
  Text as RNText,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParam } from '../../navigation';
import { useLayoutEffect, useState, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { useUserContext } from '../../context/UserContext';
import { User } from '../../types/user';
import { Tabs } from '../../components';
import { validateName, validateEmail } from '../../validation/userValidation';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParam, 'AddUserScreen'>;
}

const tabs: { key: 'ADMIN' | 'MANAGER'; label: string }[] = [
  { key: 'ADMIN', label: 'Admin' },
  { key: 'MANAGER', label: 'Manager' },
];

const AddUserScreen = ({ navigation }: Props) => {
  const route = useRoute();
  const { user } = route.params as { user?: User };
  const { createUser, updateUser } = useUserContext();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER'>(user?.role || 'ADMIN');
  const [activeIndex, setActiveIndex] = useState(0);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <RNText style={{ color: 'blue' }}>Back</RNText>
        </TouchableOpacity>
      ),
      title: user ? 'Edit User' : 'Add User',
    });
  }, [navigation, user]);

  const handleTabPress = useCallback(
    (index: number) => {
      const nextTab = tabs[index];
      if (!nextTab) {
        return;
      }
      setActiveIndex(index);
      setRole(nextTab.key);
    },
    [setActiveIndex],
  );

  const handleSave = async () => {
    // reset previous errors
    setNameError(null);
    setEmailError(null);

    // run validators
    const nErr = validateName(name);
    const eErr = validateEmail(email);

    if (nErr || eErr) {
      setNameError(nErr);
      setEmailError(eErr);
      return;
    }

    try {
      if (user) {
        await updateUser({ ...user, name, email, role });
      } else {
        await createUser({ name, email, role });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to save user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View>
          <RNText style={styles.label}>Name</RNText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={text => {
              setName(text);
              setNameError(null);
            }}
            placeholder="Enter name"
          />
          {nameError ? (
            <RNText style={styles.errorText}>{nameError}</RNText>
          ) : null}

          <RNText style={styles.label}>Email</RNText>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={text => {
              setEmail(text);
              setEmailError(null);
            }}
            placeholder="Enter email"
            keyboardType="email-address"
          />
          {emailError ? (
            <RNText style={styles.errorText}>{emailError}</RNText>
          ) : null}

          <RNText style={styles.label}>Role</RNText>
          <View style={styles.pickerContainer}>
            <Tabs
              tabs={tabs}
              activeIndex={activeIndex}
              onTabPress={handleTabPress}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <RNText style={styles.cancelButtonText}>Cancel</RNText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <RNText style={styles.saveButtonText}>Save</RNText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default AddUserScreen;
