import * as SecureStore from 'expo-secure-store';

async function saveSecure(key, value) {
    await SecureStore.setItemAsync(key, value);
}

async function getSecure(key) {
    let result = await SecureStore.getItemAsync(key);
    return result
}

async function deleteSecure(key) {
    await SecureStore.deleteItemAsync(key);
}

export { saveSecure, getSecure, deleteSecure }