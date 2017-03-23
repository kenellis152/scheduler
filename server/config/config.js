var env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/SchedulerApp';
} else if (env === 'test') {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/SchedulerAppTest';
  process.env.PORT = 3000;
}
