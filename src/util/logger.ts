export default {
  info: (str: string) => {
    process.stdout.write(`\u001b[35m[INFO] \u001b[37m|| ${str}\n`);
  }
};