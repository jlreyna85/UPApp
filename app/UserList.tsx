<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { fetchUserNames } from './tst'; // Asegúrate de que la ruta sea correcta

const UserList: React.FC = () => {
  const [userNames, setUserNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserNames = async () => {
      try {
        const names = await fetchUserNames();
        setUserNames(names);
      } catch (error) {
        Alert.alert('Error', 'Could not fetch user names');
      } finally {
        setLoading(false);
      }
    };

    loadUserNames();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Names</Text>
      <ScrollView>
        {userNames.length > 0 ? (
          userNames.map((name, index) => (
            <Text key={index} style={styles.userName}>
              {name}
            </Text>
          ))
        ) : (
          <Text style={styles.noData}>No users found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userName: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'center',
  },
  noData: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
});

export default UserList;
=======
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { fetchUserNames } from './tst'; // Asegúrate de que la ruta sea correcta

const UserList: React.FC = () => {
  const [userNames, setUserNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserNames = async () => {
      try {
        const names = await fetchUserNames();
        setUserNames(names);
      } catch (error) {
        Alert.alert('Error', 'Could not fetch user names');
      } finally {
        setLoading(false);
      }
    };

    loadUserNames();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Names</Text>
      <ScrollView>
        {userNames.length > 0 ? (
          userNames.map((name, index) => (
            <Text key={index} style={styles.userName}>
              {name}
            </Text>
          ))
        ) : (
          <Text style={styles.noData}>No users found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userName: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'center',
  },
  noData: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
});

export default UserList;
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
