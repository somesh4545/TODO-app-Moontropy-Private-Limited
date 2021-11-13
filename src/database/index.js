import Realm from 'realm';
import {taskSchema} from '../schemas';

const app = new Realm.App({id: 'todo-wzkqx'});
const credentials = Realm.Credentials.anonymous();

const getRealm = async user_id => {
  const user = await app.logIn(credentials);

  const realm = await Realm.open({
    schema: [taskSchema],
    sync: {
      user: app.currentUser,
      partitionValue: user_id,
    },
  });
  return realm;
};

export default getRealm;
