import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {FAB} from 'react-native-paper';

import {ObjectId} from 'bson';
import 'react-native-get-random-values';
import getRealm from '../database';

const AddToDo = ({navigation}) => {
  const [user_id, setUser_id] = useState('123');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: 'Add ToDo',
      headerTintColor: '#fff',
      headerShown: true,
      headerStyle: {
        backgroundColor: '#104a8e',
      },
      headerTitleStyle: {color: '#fff'},
    });
  }, []);

  const addTodo = async () => {
    // console.log(title.length);
    if (title.length > 0) {
      const realm = await getRealm(user_id);
      realm.write(() => {
        realm.create('task', {
          _id: new ObjectId(),
          user_id: user_id,
          title: title,
          description: description,
        });
        setTitle('');
        setDescription('');
        navigation.goBack();
      });
    } else {
      ToastAndroid.show('Title is empty', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={title}
        onChangeText={title => setTitle(title)}
        style={[styles.titleInput, styles.input]}
        placeholder="Enter the title"
        placeholderTextColor="#a9a9a9"
      />
      <TextInput
        value={description}
        onChangeText={description => setDescription(description)}
        multiline={true}
        numberOfLines={10}
        style={[styles.descriptionInput, styles.input]}
        placeholder="Enter the description"
        placeholderTextColor="#a9a9a9"
      />
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={addTodo}>
          <Text style={styles.submit}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddToDo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    color: '#000',
    borderColor: '#a9a9a9',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  titleInput: {
    height: 40,
    padding: 0,
  },
  descriptionInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  submitContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#104a8e',
  },
  submit: {
    fontSize: 18,
    color: '#fff',
  },
});
