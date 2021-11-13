export const taskSchema = {
  name: 'task',
  properties: {
    _id: 'objectId?',
    description: 'string?',
    title: 'string?',
    user_id: 'string?',
  },
  primaryKey: '_id',
};

export default taskSchema;
