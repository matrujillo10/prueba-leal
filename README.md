# Prueba de desarrollador Backend de Leal

## Configurar Base de Datos

Para poder ejecutar las aplicaciones, es necesario configurar la base de datos local de `MySQL`, para esto se puede utilizar el archivo `estructura.sql` que contiene el código necesario para crear las 2 tablas utilizadas en el ejercicio. Además, es necesario modificar el archivo `ormconfig.json` que se encuentra en las carpetas `transactions-creation`, `transactions-historical`, `transactions-inactivation`, `transactions-inactivation` y `user`. Este archivo contiene los datos necesarios para poder conectar con la base de datos.

## Instalar dependencias

En cada una de las carpetas se encuentran los diferentes microservicios como proyectos independientes. Por tanto, lo que se requiere es instalar las dependencias de cada proyecto utilizando el comando `npm install` y posteriormente ejecutar la aplicación con alguno de los siguientes comandos:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Servicios

Todas las aplicaciones son híbridas, por lo que cada una contiene un micro servicio y una API HTTP que permite interactuar a un cliente con el microseervicio. Por tanto, se puede utilizar un cliente HTTP siguiendo las siguientes especificaciones:

### Registro de usuario

> POST http://localhost:3000/user/register

```json
{
	"name": "John",
	"lastName": "Doe",
	"birth_date": "1998-04-03",
	"email": "john.doe@domain.com",
	"password": "secure-password"
}
```

### Inicio de sesión

> POST http://localhost:3001/login

```json
{
	"username": "john.doe@domain.com",
	"password": "secure-password"
}
```

Este servicio devuelve un token que será necesario para otros servicios. Para el propostito de probar, el token tiene una validez de un poco más que 6 días.

### Historial de transacciones

> GET http://localhost:3004/transaction/historical

Para este servicio es necesario agregar el encabezado de autorización `Authorization` con el valor `Bearer ` concatenado al token que devuelve el servicio de inicio de sesión.


### Puntos totales

> GET http://localhost:3005/transaction/points

Para este servicio es necesario agregar el encabezado de autorización `Authorization` con el valor `Bearer ` concatenado al token que devuelve el servicio de inicio de sesión.

### Exportar Excel

> GET http://localhost:3006/transaction/export

Para este servicio es necesario agregar el encabezado de autorización `Authorization` con el valor `Bearer ` concatenado al token que devuelve el servicio de inicio de sesión.

### Crear Transacción

> POST http://localhost:3002/transaction/creation

Este servicio recibe un archivo csv. [En este enlace puede encontrar un ejemplo.](https://raw.githubusercontent.com/matrujillo10/prueba-leal/master/transactions.csv)

### Inactivar Transacción

> PUT http://localhost:3003/transaction/inactivation/:id
