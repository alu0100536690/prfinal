# Paso 2: Acceso SSH a Digital Ocean

Al crear la configuración de nuestra máquina recibiremos un email con los datos de acceso.
Abrimos una consola y ejecutamos **shh root@IP** , en nuestro caso sería:


```bash
ssh root@178.62.123.244
```

Introducimos la contraseña que nos ha llegado al email, la confirmamos y luego nos pedirá nuestra nueva contraseña.
El siguiente paso es configurar una clave ssh para poder acceder automáticamente a nuestro servidor sin loguearnos. Así que volvemos a nuestra máquina local con el siguiente comando:

```bash
exit
```

Vamos al directorio **~/.ssh** de nuestra máquina local y en caso de no tener ninguna clave ejecutamos el siguiente comando:

```bash
ssh-keygen -t rsa
```

Por último copiamos la información de nuestra clave pública de la máquina local a nuestro servidor remoto, en este ejemplo copiaremos la información de **id_dsa.pub** que se encuentra en la máquina local al fichero **~/.ssh/authorized_keys** de la máquina remota. Con el comando que aparece a continuación. Te en cuenta que **root@178.62.123.244** es el usuario y la IP de la máquina remota.

```bash
cat ~/.ssh/*.pub | ssh root@178.62.123.244 'umask 077; mkdir -p .ssh; cat >> .ssh/authorized_keys'
```

