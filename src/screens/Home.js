import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from 'react-native';

import Realm from 'realm';
import {FAB, Button} from 'react-native-paper';

import {ObjectId} from 'bson';
// import 'react-native-get-random-values';
import getRealm from '../database';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Somesh',
    description: 'This is description text',
  },
  {
    id: 'bd7cbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Somesh',
    description: 'This is description text',
  },
];

const Home = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [totalTask, setTotalTask] = useState(0);
  const [tasks, setTasks] = useState(DATA);
  const [user_id, setUser_id] = useState('123');

  useEffect(() => {
    getRealm(user_id)
      .then(realm => {
        const task = realm.objects('task');
        setTasks(task);
        setTotalTask(task.length);
        task.addListener(() => {
          setTasks([...task]);
          setTotalTask(task.length);
        });
        setLoading(false);
        return () => {
          const task = realm.objects('task');
          task.removeListener();
          realm.close();
        };
      })
      .catch(error => {
        console.log(error);
      });

    navigation.setOptions({
      title: 'ToDo App',
      headerShown: true,
      headerStyle: {
        backgroundColor: '#104a8e',
      },
      headerTitleStyle: {color: '#fff'},
    });
  }, []);

  const addNote = () => {
    navigation.navigate('AddToDo');
  };

  const deleteTodo = async id => {
    const realm = await getRealm(user_id);
    const deleteItem = realm.objectForPrimaryKey('task', id);
    realm.write(() => {
      if (deleteItem) {
        realm.delete(deleteItem);
      }
    });
    console.log(id);
  };

  return (
    <View style={styles.container}>
      {loading == true ? (
        <View style={styles.centerDisplay}>
          <ActivityIndicator size="large" color="#104a8e" />
        </View>
      ) : totalTask == 0 ? (
        <View style={styles.centerDisplay}>
          <Text style={{fontSize: 15}}>
            Press the add TODO button to add new TODO's
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          <FlatList
            data={tasks}
            style={styles.list}
            renderItem={({item}) => {
              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.title}</Text>
                    <TouchableOpacity
                      style={{width: 20, height: 20}}
                      onPress={() => deleteTodo(item._id)}>
                      <Icon name="trash" style={styles.deleteBtn} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              );
            }}
            keyExtractor={item => item._id}
          />
        </View>
      )}
      <FAB
        style={styles.addBtn}
        small
        icon="plus"
        label="Add ToDo"
        onPress={addNote}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
  },
  centerDisplay: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    // paddingBottom: 20,
    // paddingHorizontal: 5,
  },
  card: {
    // marginHorizontal: 5,
    margin: 20,
    elevation: 5,
    borderRadius: 10,
    padding: 10,
    // marginTop: 15,
    marginBottom: 2,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    width: '80%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteBtn: {
    fontSize: 15,
    color: 'red',
  },
  description: {
    fontSize: 13,
    lineHeight: 15,
    opacity: 0.7,
  },
  addBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#104a8e',
  },
});
