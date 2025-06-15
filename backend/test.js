const bcrypt = require('bcryptjs');

async function test() {
  const passwordPlain = '123456';
  const hash = await bcrypt.hash(passwordPlain, 10);

  console.log('Hash generado:', hash);

  const esValido = await bcrypt.compare('123456', hash);
  console.log('¿Password coincide?:', esValido);
}

test();
