
# Prototipo Control de Producción - Quality Pizzafresh

Este proyecto es un prototipo de aplicación web para organizar y visualizar el control de producción de bases de pizza precocinadas.

## ¿Cómo probarlo en local?

1. **Instala las dependencias:**

	```bash
	npm install
	```

2. **Arranca el servidor de desarrollo:**

	```bash
	npm run dev
	```

3. **Abre tu navegador en:**

	[http://localhost:3000](http://localhost:3000)

## Funcionalidades principales

- Formulario para ingresar el número de bolas a producir.
- Cálculo automático del número de torres (1 torre = 200 bolas).
- Visualización de cada torre con botones para comenzar y finalizar el estirado.
- Registro de hora, temperatura y humedad genérica al inicio y fin de cada torre.
- Estado visual por color: gris (pendiente), amarillo (en proceso), verde (finalizado).
- Diseño responsive y modular usando Bootstrap y Tailwind CSS.

## Notas
- Este prototipo está preparado para bolas de 160g, 8 por caja, 25 cajas por torre.
- El diseño es sencillo, cumple estándares WC3 y es fácilmente ampliable.
