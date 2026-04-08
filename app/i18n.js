(() => {
  'use strict';

  const STORAGE_KEY = 'adamis_lang';
  const SUPPORTED = ['es', 'en'];
  const FALLBACK = 'es';

  const DICT = {
    es: {
      common: {
        langLabel: 'Idioma',
        langSwitch: 'EN',
        langSwitchAria: 'Cambiar idioma a inglés',
        loading: 'Cargando...',
        loadingTemplate: 'Cargando plantilla...',
        renderError: 'No se pudo renderizar esta diapositiva.',
        touchContinue: 'Toca para continuar',
        clickContinue: 'Haz clic para continuar'
      }
    },
    en: {
      common: {
        langLabel: 'Language',
        langSwitch: 'ES',
        langSwitchAria: 'Switch language to Spanish',
        loading: 'Loading...',
        loadingTemplate: 'Loading template...',
        renderError: 'This slide could not be rendered.',
        touchContinue: 'Tap to continue',
        clickContinue: 'Click to continue'
      }
    }
  };

  const TEXT_MAP = new Map([
    ['Salir', 'Log out'],
    ['Ajustes', 'Settings'],
    ['Idioma', 'Language'],
    ['¿Cerrar sesión?', 'Log out?'],
    ['Vas a salir de tu sesión. Podrás volver a entrar cuando quieras.', 'You are about to log out. You can sign in again at any time.'],
    ['Cancelar', 'Cancel'],
    ['Cerrar sesión', 'Log out'],
    ['Cerrar', 'Close'],
    ['Recompensa', 'Reward'],
    ['Normas de la Actividad', 'Activity Rules'],
    ['Normas de la actividad', 'Activity Rules'],
    ['Monedas', 'Coins'],
    ['Continuar', 'Continue'],
    ['Siguiente', 'Next'],
    ['Atrás', 'Back'],
    ['Atras', 'Back'],
    ['Cargando…', 'Loading...'],
    ['Cargando...', 'Loading...'],
    ['Cargando plantilla…', 'Loading template...'],
    ['No se pudo renderizar esta diapositiva.', 'This slide could not be rendered.'],
    ['Menú', 'Menu'],
    ['Menú principal', 'Main menu'],
    ['Elige una clase:', 'Choose a class:'],
    ['Cargar', 'Load'],
    ['Ahorro', 'Savings'],
    ['Deuda', 'Debt'],
    ['Clase', 'Class'],
    ['Actividades', 'Activities'],
    ['Ranking', 'Ranking'],
    ['Mapa', 'Map'],
    ['Mapa de niveles', 'Level map'],
    ['Encuesta general', 'General survey'],
    ['Acceso', 'Login'],
    ['Acceso Plataforma', 'Platform Access'],
    ['Bienvenido', 'Welcome'],
    ['Usuario / Email', 'Username / Email'],
    ['Tu futuro financiero empieza aquí.', 'Your financial future starts here.'],
    ['Descubrir la realidad', 'Discover the reality'],
    ['Realidad Financiera', 'Financial Reality'],
    ['El sistema educativo ha olvidado lo esencial.', 'The education system has forgotten what is essential.'],
    ['La solución es ADAMIS', 'The solution is ADAMIS'],
    ['Para Familias', 'For Families'],
    ['Para Colegios', 'For Schools'],
    ['¿Por qué funciona?', 'Why does it work?'],
    ['Gamificación', 'Gamification'],
    ['Simulador Real', 'Real Simulator'],
    ['Control Total', 'Total Control'],
    ['Formulario de acceso', 'Login form'],
    ['¡Bienvenido/a de Nuevo!', 'Welcome back!'],
    ['Usuario', 'Username'],
    ['Escribe tu usuario', 'Type your username'],
    ['Contraseña', 'Password'],
    ['Inciar Sesión', 'Sign in'],
    ['Iniciar Sesión', 'Sign in'],
    ['Tienda', 'Shop'],
    ['Ir a la tienda', 'Go to shop'],
    ['Monedas disponibles', 'Available coins'],
    ['Accesos de tienda', 'Shop access'],
    ['Clasificación Top 5', 'Top 5 ranking'],
    ['Ilustración', 'Illustration'],
    ['Canjea tus monedas', 'Redeem your coins'],
    ['Elige articulos segun tu saldo disponible.', 'Choose items based on your available balance.'],
    ['Orden', 'Sort'],
    ['Ordenar articulos', 'Sort items'],
    ['Mayor a menor', 'Highest to lowest'],
    ['Menor a mayor', 'Lowest to highest'],
    ['No hay articulos disponibles.', 'No items available.'],
    ['Comprar', 'Buy'],
    ['Sin descripcion.', 'No description.'],
    ['Sin limite', 'No limit'],
    ['Stock', 'Stock'],
    ['Stock:', 'Stock:'],
    ['Comprado:', 'Purchased:'],
    ['Peluche Adamis', 'Adamis plush'],
    ['Un peluche del personaje Adamis.', 'A plush of the Adamis character.'],
    ['Entrada de cine', 'Movie ticket'],
    ['Una entrada para disfrutar una pelicula.', 'A ticket to enjoy a movie.'],
    ['Una entrada para disfrutar una película.', 'A ticket to enjoy a movie.'],
    ['Balon de volleyball', 'Volleyball'],
    ['Balón de volleyball', 'Volleyball'],
    ['BalÃ³n de volleyball', 'Volleyball'],
    ['Un balon de volleyball oficial.', 'An official volleyball.'],
    ['Un balón de volleyball oficial.', 'An official volleyball.'],
    ['Un balÃ³n de volleyball oficial.', 'An official volleyball.'],
    ['Balon de futbol', 'Soccer ball'],
    ['Balón de futbol', 'Soccer ball'],
    ['BalÃ³n de futbol', 'Soccer ball'],
    ['Un balon de futbol de La Liga.', 'A La Liga soccer ball.'],
    ['Un balón de futbol de La Liga.', 'A La Liga soccer ball.'],
    ['Un balÃ³n de futbol de La Liga.', 'A La Liga soccer ball.'],
    ['Sesion de baloncesto', 'Basketball session'],
    ['Una hora de juego en la cancha.', 'One hour of play on the court.'],
    ['Salida a acampar', 'Camping trip'],
    ['Equipo basico para una noche al aire libre.', 'Basic gear for a night outdoors.'],
    ['Partido de futbol', 'Soccer match'],
    ['Un partido amistoso con tus amigos.', 'A friendly match with your friends.'],
    ['Sin stock disponible', 'Out of stock'],
    ['Limite por usuario alcanzado', 'Per-user limit reached'],
    ['Precio invalido', 'Invalid price'],
    ['Te faltan {n} monedas', 'You need {n} more coins'],
    ['No se puede comprar ahora.', 'Cannot buy right now.'],
    ['No se pudo cargar la tienda.', 'Shop could not be loaded.'],
    ['No se pudo cargar el listado de articulos.', 'Item list could not be loaded.'],
    ['Compra realizada: {name}.', 'Purchase completed: {name}.'],
    ['Actividades diarias (1 moneda)', 'Daily activities (1 coin)'],
    ['Diarias', 'Daily'],
    ['Crucigrama del día', 'Crossword of the day'],
    ['Palabra del día', 'Word of the day'],
    ['Frase del día', 'Sssssentence of the day'],
    ['Frassse del día', 'Sssssentence of the day'],
    ['Frasssse del día', 'Sssssentence of the day'],
    ['Semanales', 'Weekly'],
    ['Actividades semanales (5 monedas)', 'Weekly activities (5 coins)'],
    ['Oferta y Demanda', 'Supply and Demand'],
    ['Error en el ticket', 'Receipt Error'],
    ['Tu compra', 'Your purchase'],
    ['Objeto', 'Item'],
    ['Valor', 'Price'],
    ['Unidades', 'Units'],
    ['Total:', 'Total:'],
    ['No hay ningun error', 'There is no error'],
    ['Pagaste:', 'You paid:'],
    ['Te devolvieron:', 'Change returned:'],
    ['Total del ticket', 'Receipt total'],
    ['Te devolvieron', 'Change returned'],
    ['Otro ticket', 'Another receipt'],
    ['Salir al menu', 'Exit to menu'],
    ['Actividad mensual (10 monedas)', 'Monthly activity (10 coins)'],
    ['Mensual', 'Monthly'],
    ['Proyecto de ahorro del mes', 'Monthly savings project'],
    ['Tablero de letras', 'Letter board'],
    ['Teclado en pantalla', 'On-screen keyboard'],
    ['Confirmar', 'Confirm'],
    ['Resultado', 'Result'],
    ['¡Correcto!', 'Correct!'],
    ['Entendido', 'Got it'],
    ['¡Bien hecho!', 'Well done!'],
    ['Se acabaron los intentos', 'No attempts left'],
    ['La palabra era', 'The word was'],
    ['Diccionario vacío', 'Empty dictionary'],
    ['¡Listo!', 'Ready!'],
    ['No se pudo cargar \'palabras\'', 'Could not load word list'],
    ['Palabra incompleta', 'Incomplete word'],
    ['Cargando…', 'Loading...'],
    ['Crucigrama del dia', 'Crossword of the day'],
    ['Tablero del crucigrama', 'Crossword board'],
    ['Pistas', 'Clues'],
    ['Horizontal', 'Across'],
    ['Vertical', 'Down'],
    ['Comprobar', 'Check'],
    ['Nuevo', 'New'],
    ['¡Crucigrama completado!', 'Crossword completed!'],
    ['Has completado todas las palabras del crucigrama.', 'You completed all crossword words.'],
    ['Hay letras incorrectas', 'There are incorrect letters'],
    ['Revisa las letras marcadas', 'Review highlighted letters'],
    ['Sigue completando', 'Keep completing'],
    ['No se pudo crear un crucigrama', 'Could not build a crossword'],
    ['No hay imagenes en assets_ticket.', 'No images found in assets_ticket.'],
    ['Botella de agua', 'Water bottle'],
    ['Gafas de sol', 'Sunglasses'],
    ['Gorra', 'Cap'],
    ['Libro', 'Book'],
    ['Lapiz', 'Pencil'],
    ['Osito', 'Teddy bear'],
    ['Pan', 'Bread'],
    ['Patata', 'Potato'],
    ['Tomate', 'Tomato'],
    ['Agrega PNG, JPG, JPEG, WEBP o AVIF para iniciar la actividad.', 'Add PNG, JPG, JPEG, WEBP or AVIF files to start this activity.'],
    ['Abre la pagina con un servidor local o actualiza manifest.js con tus imagenes.', 'Open this page with a local server or update manifest.js with your images.'],
    ['Si hay errores', 'There are errors'],
    ['Perfecto. No tuviste fallos.', 'Perfect. You made no mistakes.'],
    ['Has terminado con {n} fallo.', 'You finished with {n} mistake.'],
    ['Has terminado con {n} fallos.', 'You finished with {n} mistakes.'],
    ['Frase del día', 'Sssssentence of the day'],
    ['Progreso de la frase', 'Phrase progress'],
    ['Tablero del juego', 'Game board'],
    ['Reiniciar', 'Restart'],
    ['Has perdido', 'You lost'],
    ['Game Over', 'Game Over'],
    ['Te chocaste con la pared o contigo mismo. ¿Quieres reiniciar?', 'You hit a wall or yourself. Do you want to restart?'],
    ['¡Frase completada!', 'Phrase completed!'],
    ['Pantalla de inicio', 'Start screen'],
    ['Toca en cualquier parte para sumergirte en una aventura de educación financiera', 'Tap anywhere to start a financial education adventure'],
    ['Acceso Estudiantes', 'Student Access'],
    ['Selecciona tu centro', 'Select your school'],
    ['Contraseña de la Clase', 'Class password'],
    ['Entrar', 'Enter'],
    ['🚫 Contraseña incorrecta', '🚫 Incorrect password'],
    ['Oferta y demanda', 'Supply and demand'],
    ['Simulador educativo de una heladeria: ajusta stock y precios segun el clima.', 'Educational simulator: adjust stock and prices based on weather.'],
    ['Fases del dia', 'Day phases'],
    ['Preparacion', 'Preparation'],
    ['Simulacion', 'Simulation'],
    ['Balance', 'Balance'],
    ['Soleado', 'Sunny'],
    ['Nublado', 'Cloudy'],
    ['Lluvioso', 'Rainy'],
    ['Dia ideal: la demanda suele ser alta.', 'Ideal day: demand is usually high.'],
    ['Demanda estable: ajusta el precio con cuidado.', 'Stable demand: adjust price carefully.'],
    ['Dia dificil: pocos clientes y menor disposicion a pagar.', 'Tough day: fewer customers and lower willingness to pay.'],
    ['Ahorrador', 'Saver'],
    ['Impulsivo', 'Impulsive'],
    ['Evento común', 'Common event'],
    ['Evento raro', 'Rare event'],
    ['Evento muy muy exclusivo', 'Very exclusive event'],
    ['Ola turística', 'Tourist wave'],
    ['Competencia cercana', 'Nearby competition'],
    ['Festival del barrio', 'Neighborhood festival'],
    ['Promoción en redes', 'Social media promotion'],
    ['Brisa fría', 'Cold breeze'],
    ['Oleada de clientes', 'Customer wave'],
    ['Oleada de ahorradores', 'Saver wave'],
    ['Oleada de impulsivos', 'Impulsive wave'],
    ['Oleada de VIPs', 'VIP wave'],
    ['Posible causa del evento:', 'Possible event cause:'],
    ['Empieza la jornada. Ajusta el precio.', 'The day starts. Adjust your price.'],
    ['Reanudar', 'Resume'],
    ['Compra', 'Buy'],
    ['Ganancia neta', 'Net profit'],
    ['Perdida neta', 'Net loss'],
    ['Sin merma de stock.', 'No stock waste.'],
    ['Máximo posible de ingresos si priorizabas VIPs, luego impulsivos y después ahorradores.', 'Maximum possible income if you prioritized VIPs, then impulsive customers, then savers.'],
    ['Dia ideal para vender helados.', 'Ideal day to sell ice cream.'],
    ['Compra de stock', 'Stock purchase'],
    ['Capital inicial', 'Initial capital'],
    ['Unidades', 'Units'],
    ['Costo total', 'Total cost'],
    ['Dinero restante', 'Remaining money'],
    ['Precio inicial', 'Initial price'],
    ['Bajar precio', 'Lower price'],
    ['Subir precio', 'Raise price'],
    ['Paso de precio', 'Price step'],
    ['ABRIR TIENDA', 'OPEN SHOP'],
    ['Pausar', 'Pause'],
    ['Cerrar tienda', 'Close shop'],
    ['Hora', 'Time'],
    ['Dinero', 'Money'],
    ['Precio actual', 'Current price'],
    ['Ultimo cliente', 'Last customer'],
    ['Listo para abrir.', 'Ready to open.'],
    ['Perfiles de clientes', 'Customer profiles'],
    ['Naranja · Impulsivo', 'Orange · Impulsive'],
    ['Azul · Ahorrador', 'Blue · Saver'],
    ['Púrpura · VIP', 'Purple · VIP'],
    ['Toca un perfil para ver su forma de comprar.', 'Tap a profile to see buying behavior.'],
    ['Balance del día', 'Day balance'],
    ['Dinero inicial', 'Initial money'],
    ['Gasto en helados', 'Ice cream expense'],
    ['Ingresos por ventas', 'Sales revenue'],
    ['Penalización por sobrantes', 'Leftover penalty'],
    ['Total final', 'Final total'],
    ['Máximo posible', 'Maximum possible'],
    ['Desglose financiero', 'Financial breakdown'],
    ['Gastos (stock)', 'Expenses (stock)'],
    ['Balance final', 'Final balance'],
    ['Embudo de clientes', 'Customer funnel'],
    ['Total', 'Total'],
    ['Compraron', 'Bought'],
    ['Muy caro', 'Too expensive'],
    ['Sin stock', 'Out of stock'],
    ['Rendimiento por hora', 'Hourly performance'],
    ['Ventas', 'Sales'],
    ['Jugar otro dia', 'Play another day'],
    ['Detalle del máximo posible', 'Maximum possible detail'],
    ['Cerrar detalle', 'Close detail'],
    ['Cerrar perfiles', 'Close profiles'],
    ['No hay frases para ordenar.', 'There are no phrases to order.'],
    ['Pulsa las palabras para construir la frase. Pulsa una palabra ya colocada para devolverla.', 'Tap words to build the sentence. Tap an already placed word to return it.'],
    ['Tu frase', 'Your sentence'],
    ['Palabras', 'Words'],
    ['Saltar frase', 'Skip phrase'],
    ['Correcto. Muy bien.', 'Correct. Very good.'],
    ['Orden incorrecto. Intentalo de nuevo.', 'Incorrect order. Try again.'],
    ['Respuesta muy corta', 'Answer too short'],
    ['Longitud aceptable', 'Acceptable length'],
    ['Buena longitud de respuesta', 'Good answer length'],
    ['Cuadro de reflexión', 'Reflection box'],
    ['Escribe aquí tu idea principal…', 'Write your main idea here...'],
    ['Evaluar', 'Evaluate'],
    ['Evaluando…', 'Evaluating...'],
    ['No se pudo evaluar ahora. Tu respuesta se ha guardado.', 'Could not evaluate right now. Your answer has been saved.'],
    ['Continuar a Actividad', 'Continue to Activity'],
    ['Volver', 'Back'],
    ['No necesario', 'Not needed'],
    ['Impaciencia', 'Impatience'],
    ['Pagar', 'Pay'],
    ['Rechazar', 'Reject'],
    ['Pedir préstamo', 'Request loan'],
    ['Pedir prÃ©stamo', 'Request loan'],
    ['Devolver préstamo', 'Repay loan'],
    ['Devolver prÃ©stamo', 'Repay loan'],
    ['Sin préstamos', 'No loans'],
    ['Sin prÃ©stamos', 'No loans'],
    ['Cantidad', 'Amount'],
    ['Semanas', 'Weeks'],
    ['Estado', 'Status'],
    ['Activo', 'Active'],
    ['Impagado', 'Overdue'],
    ['sem.', 'wk.'],
    ['¿Deseas devolver este préstamo?', 'Do you want to repay this loan?'],
    ['Â¿Deseas devolver este prÃ©stamo?', 'Do you want to repay this loan?'],
    ['Importe a devolver', 'Amount to repay'],
    ['Importe a devolver:', 'Amount to repay:'],
    ['Selecciona el préstamo', 'Select the loan'],
    ['Selecciona el prÃ©stamo', 'Select the loan'],
    ['Semanas para devolver', 'Weeks to repay'],
    ['No tienes saldo suficiente para devolver este préstamo.', 'You do not have enough balance to repay this loan.'],
    ['No tienes saldo suficiente para devolver este prÃ©stamo.', 'You do not have enough balance to repay this loan.'],
    ['Sí', 'Yes'],
    ['SÃ­', 'Yes'],
    ['Información sobre la tabla', 'Information about the table'],
    ['Pulsa para más información', 'Tap for more information'],
    ['Pulsa para ver', 'Tap to view'],
    ['¿Cómo usar la tabla de préstamos?', 'How to use the loans table?'],
    ['Préstamo bloqueado', 'Loan blocked'],
    ['Saldo insuficiente', 'Insufficient balance'],
    ['No puedes pagar', 'You cannot pay'],
    ['No tienes saldo suficiente para devolver este préstamo.', 'You do not have enough balance to repay this loan.'],
    ['Necesitas saldo suficiente para pagar esta actividad.', 'You need enough balance to pay for this activity.'],
    ['Necesitas saldo suficiente para pagar.', 'You need enough balance to pay.'],
    ['¿Podrás pagar ahora?', 'Will you be able to pay now?'],
    ['Â¿PodrÃ¡s pagar ahora?', 'Will you be able to pay now?'],
    ['No puedes pedir préstamos hasta saldar impagos.', 'You cannot request loans until overdue loans are settled.'],
    ['Devuelve primero los préstamos impagados.', 'Repay overdue loans first.'],
    ['Paga directamente con tu saldo.', 'Pay directly with your balance.'],
    ['Introduce una cantidad entera (sin decimales).', 'Enter an integer amount (no decimals).'],
    ['Las semanas deben ser un número entero.', 'Weeks must be an integer number.'],
    ['Si pagas, la impaciencia bajará', 'If you pay, impatience will decrease'],
    ['Si rechazas, la impaciencia subirá', 'If you reject, impatience will increase'],
    ['Ya tienes saldo suficiente para pagar esta actividad.', 'You already have enough balance to pay for this activity.'],
    ['Término Especial', 'Special Term'],
    ['Asesor de Ahorro', 'Savings Advisor'],
    ['Asesor de ahorro', 'Savings Advisor'],
    ['Un Asesor de ahorro es una persona que te ayuda a tomar decisiones sobre si debes gastar o debes ahorrar para cumplir unas metas.', 'A savings advisor is someone who helps you decide whether to spend or save to reach your goals.'],
    ['¿Cómo manejas la deuda?', 'How do you manage debt?'],
    ['La actividad dura 8 semanas (8 decisiones).', 'The activity lasts 8 weeks (8 decisions).'],
    ['Cada semana, Lucía recibe 5 monedas de paga.', 'Each week, Lucia receives 5 allowance coins.'],
    ['A lo largo de la semana, sus amigos propondrán planes.', 'During the week, her friends will suggest plans.'],
    ['Tú deberás decidir si Lucía acepta o rechaza cada plan.', 'You must decide whether Lucia accepts or rejects each plan.'],
    ['Al final, Lucía quiere comprarse una bici nueva (30 monedas).', 'In the end, Lucia wants to buy a new bike (30 coins).'],
    ['Lucía no deberá estar muy triste al final', 'Lucia should not end up too sad'],
    ['Recibirás 1 si Lucía consigue la Bici y no está muy triste', 'You will receive 1 if Lucia gets the bike and is not too sad'],
    ['Recibirás 1 moneda si Lucía consigue la Bici y no está muy triste', 'You will receive 1 if Lucia gets the bike and is not too sad'],
    ['Recibirás 1moneda si Lucía consigue la Bici y no está muy triste', 'You will receive 1 if Lucia gets the bike and is not too sad'],
    ['RecibirÃ¡s 1 si LucÃ­a consigue la Bici y no estÃ¡ muy triste', 'You will receive 1 if Lucia gets the bike and is not too sad'],
    ['RecibirÃ¡s 1 moneda si LucÃ­a consigue la Bici y no estÃ¡ muy triste', 'You will receive 1 if Lucia gets the bike and is not too sad'],
    ['RecibirÃ¡s 1moneda si LucÃ­a consigue la Bici y no estÃ¡ muy triste', 'You will receive 1 if Lucia gets the bike and is not too sad'],
    ['Osi se va a enfrentar a diferentes situaciones y vas a tener que ayudarle a tomar decisiones.', 'Osi will face different situations and you will need to help make decisions.'],
    ['Osi tiene una paga semanal de 12€ y se te mostrará su saldo actual.', 'Osi has a weekly allowance of €12 and their current balance will be shown.'],
    ['Osi puede optar por ahorrar dinero.', 'Osi can choose to save money.'],
    ['Osi puede pedir prestado dinero y los préstamos aparecerán en una tabla.', 'Osi can borrow money and loans will appear in a table.'],
    ['Si Osi pide prestado, tendrá que devolverlo en las semanas siguientes. Si no lo hace tendrá que pagar una penalización de 12€.', 'If Osi borrows money, it must be repaid in the following weeks. Otherwise, there will be a €12 penalty.'],
    ['Cuanto mejor gestiones su dinero ¡más monedas podrás ganar para el ranking!', 'The better you manage Osi’s money, the more coins you can earn for the ranking!'],
    ['Los caprichos son una deuda mala.', 'Whims are bad debt.'],
    ['La deuda buena genera más dinero.', 'Good debt generates more money.'],
    ['Introducción', 'Introduction'],
    ['Actividad Interactiva', 'Interactive Activity'],
    ['Miniactividad', 'Mini activity'],
    ['Empezar', 'Start'],
    ['Enviar y seguir', 'Submit and continue'],
    ['¡Muchas Gracias!', 'Thank you very much!'],
    ['Sección 1', 'Section 1'],
    ['Sección 2', 'Section 2'],
    ['Semana 1', 'Week 1'],
    ['Semana 2', 'Week 2'],
    ['Semana 3', 'Week 3'],
    ['Semana 4', 'Week 4'],
    ['Semana 5', 'Week 5'],
    ['Semana 6', 'Week 6'],
    ['Semana 7', 'Week 7'],
    ['Semana 8', 'Week 8'],
    ['Semana 8: Cierre', 'Week 8: Closing'],
    ['Tutorial de deuda', 'Debt tutorial'],
    ['Interés y Riesgo', 'Interest and Risk'],
    ['Ahorros', 'Savings'],
    ['Empleo estable', 'Stable job'],
    ['Buen historial', 'Good history'],
    ['Con trabajo parcial', 'With part-time work'],
    ['Con unos pocos ahorros', 'With some savings'],
    ['Cumplió en su anterior préstamo', 'They met their previous loan commitment'],
    ['Ordena la frase haciendo clic en las palabras en el orden correcto.', 'Order the sentence by clicking the words in the correct order.'],
    ['¿Te gustaría tener una asignatura para aprender a usar el dinero?', 'Would you like a subject to learn how to use money?'],
    ['¿Te gusta dar clase usando el ordenador?', 'Do you like learning using a computer?'],
    ['Cuántas veces te gustaría tener a la semana una clase de Educación Financiera.', 'How many times per week would you like to have a Financial Education class?'],
    ['Del 1 al 10 ¿Cuánto crees que te servirá lo que has aprendido hoy para tu vida fuera del colegio (con tu familia, tus ahorros o tus compras)?', 'From 1 to 10, how useful do you think what you learned today will be for your life outside school (with your family, savings or purchases)?'],
    ['¡Holaa! Mi nombre es Adamis.', 'Hi! My name is Adamis.'],
    ['Y, ¡voy a acompañarte a explorar el mundo del ahorro!', 'And I will guide you to explore the world of saving!'],
    ['Antes de nada, hay una pregunta clave que nos tenemos que hacer...', 'Before anything else, there is a key question we need to ask...'],
    ['¿Y si, en vez de gastar todo el dinero que tenemos...', 'What if, instead of spending all the money we have...'],
    ['... guardamos una parte?', '...we save a part of it?'],
    ['¡Hoy descubriremos el súperpoder del AHORRO!', 'Today we will discover the superpower of SAVING!'],
    ['Si quisieras comprarte una bici, ¿cómo ahorrarías para conseguirla?', 'If you wanted to buy a bike, how would you save to get it?'],
    ['Imagina dos amigos, Alex y Sofía, que reciben 20€ de paga cada semana.', 'Imagine two friends, Alex and Sofia, who receive €20 of allowance each week.'],
    ['Alex gasta todo su dinero durante la semana, comprando cosas sin pensar en el futuro.', 'Alex spends all his money during the week, buying things without thinking about the future.'],
    ['Sofía disfruta parte de su dinero, pero cada semana guarda 7 € en su hucha.', 'Sofia enjoys part of her money, but each week she saves €7 in her piggy bank.'],
    ['Después de 5 semanas, sus amigos proponen ir al ¡Parque de Atracciones!', 'After 5 weeks, their friends suggest going to the amusement park!'],
    ['Pero... La entrada no es gratis... ¡Cuesta 30 €!', 'But... the ticket is not free... it costs €30!'],
    ['Alex quiere ir, pero no tiene dinero ahorrado. Solo tiene su paga de la semana y no le llega.', 'Alex wants to go, but he has no savings. He only has this week’s allowance and it is not enough.'],
    ['Sofía tiene 35 € ahorrados, y si suma su paga de esa semana, ¡puede ir y todavía le sobra dinero!', 'Sofia has saved €35, and if she adds that week’s allowance, she can go and still have money left!'],
    ['¿Ves la diferencia? Ahorrar te da libertad para elegir.', 'Do you see the difference? Saving gives you freedom to choose.'],
    ['Así puedes estar preparado cuando realmente necesitas algo o encuentras algo que te encanta.', 'That way you are prepared when you truly need something or find something you love.'],
    ['No se trata de guardar todo sin disfrutar, sino de encontrar el equilibrio.', 'It is not about saving everything without enjoying life, but about finding balance.'],
    ['Pero ahorrar tiene muchos más beneficios. ¡Vamos a verlos!', 'But saving has many more benefits. Let’s see them!'],
    ['¡Te prepara para emergencias!', 'It prepares you for emergencies!'],
    ['Si surge un problema, como que se te rompan los auriculares...', 'If a problem appears, like your headphones breaking...'],
    ['... el dinero ahorrado te ayuda a solucionarlo rápido.', '...saved money helps you solve it quickly.'],
    ['Cuando ahorras, piensas mejor en qué gastas tu dinero...', 'When you save, you think better about what to spend your money on...'],
    ['... y evitas comprar cosas solo porque te apetecen en ese momento.', '...and you avoid buying things just because you feel like it at that moment.'],
    ['¿Te gustaría viajar?', 'Would you like to travel?'],
    ['¿Comprar una bici nueva?', 'Buy a new bike?'],
    ['O quizá... ¿Montar un Negocio?', 'Or maybe... start a business?'],
    ['Si ahorras poco a poco, ¡puedes conseguirlo!', 'If you save little by little, you can achieve it!'],
    ['Además, ¡puedes tomar decisiones sin depender de nadie! Esto lo veremos más adelante', 'Also, you can make decisions without depending on anyone! We will see this later.'],
    ['¡Genial! Ahora vamos a hacer una actividad para ver si has entendido por qué AHORRAR es tan importante.', 'Great! Now we will do an activity to check if you understood why SAVING is so important.'],
    ['Hola! Soy Lucía.', 'Hi! I am Lucia.'],
    ['Necesito que me ayudes a manejar mi dinero.', 'I need you to help me manage my money.'],
    ['Lo que quiero es que seas mi asesor de ahorro.', 'I want you to be my savings advisor.'],
    ['Dentro de 8 semanas me quiero comprar una bici nueva.', 'In 8 weeks I want to buy a new bike.'],
    ['Pero todas las semanas mis amigos me invitan a planes... y gastaré dinero.', 'But every week my friends invite me to plans... and I will spend money.'],
    ['Si consigues que ahorre suficiente y no esté muy triste al final, ¡te recompensaré!', 'If you help me save enough and not end up too sad, I will reward you!'],
    ['¡La primera paga semanal!', 'The first weekly allowance!'],
    ['¡Tarde de juegos con pizzas!', 'Game afternoon with pizza!'],
    ['Así afecta tu decisión…', 'This is how your decision affects it...'],
    ['¡Al empezar la segunda semana Lucía recibe la paga!', 'At the start of week two, Lucia gets her allowance!'],
    ['Lucía va por la calle y ve una tienda. ¡Quiere comprar un cómic!', 'Lucia is walking down the street and sees a shop. She wants to buy a comic!'],
    ['Mi momento favorito, ¡hooora de la paga!', 'My favorite moment, allowance time!'],
    ['Tarde de bolera y restaurante con amigos. Ir le daría a Lucía mucha felicidad.', 'Bowling and restaurant afternoon with friends. Going would make Lucia very happy.'],
    ['Cuarta semana, ¡cuarta paga!', 'Fourth week, fourth allowance!'],
    ['Esta semana unos amigos del colegio me han invitado a un torneo de baloncesto.', 'This week, some school friends invited me to a basketball tournament.'],
    ['Seguro que me divierto pero no soy muy fan de este deporte.', 'I will probably have fun, but I am not a big fan of this sport.'],
    ['Pero otros amigos de mi urbanización me han invitado a ver un partido de fútbol profesional. ¡Me encanta el fútbol!', 'But other friends from my neighborhood invited me to watch a professional soccer match. I love soccer!'],
    ['¿Torneo de baloncesto o partido de fútbol?', 'Basketball tournament or soccer match?'],
    ['¡Lucía recibe la paga!', 'Lucia receives her allowance!'],
    ['No me gusta mi funda de móvil, me quiero comprar una nueva.', 'I do not like my phone case, I want a new one.'],
    ['¿Se debe comprar Lucía una funda nueva?', 'Should Lucia buy a new phone case?'],
    ['¡La sexta paga!', 'The sixth allowance!'],
    ['Esta semana mi familia me ha propuesto acampar en el campo. ¡Me encanta pasar tiempo con ellos!', 'This week my family suggested camping in the countryside. I love spending time with them!'],
    ['Unos amigos me han propuesto ir a ver una peli que se estrena esta semana y llevo meses esperando.', 'Some friends suggested watching a movie that premieres this week and I have been waiting for months.'],
    ['Me encantan los dos planes, ¿qué hago?', 'I love both plans, what should I do?'],
    ['Ir al estreno de la película o acampar con su familia.', 'Go to the movie premiere or camp with family.'],
    ['¡Séptima paga semanal!', 'Seventh weekly allowance!'],
    ['¡Ohh! Se me había olvidado que tengo que entregar una maqueta del sistema solar.', 'Oh! I forgot I need to submit a solar system model.'],
    ['Y no tengo los materiales.', 'And I do not have the materials.'],
    ['¿Compra los materiales?', 'Should she buy the materials?'],
    ['¡La última paga!', 'The last allowance!'],
    ['¿Has visto qué importante es pensar antes de gastar?', 'Did you see how important it is to think before spending?'],
    ['Aprender a equilibrar el ahorro y la diversión es clave para cumplir tus metas.', 'Learning to balance saving and fun is key to achieving your goals.'],
    ['A veces, nos podemos dejar llevar por el momento y gastar de más...', 'Sometimes we get carried away by the moment and spend too much...'],
    ['...pero si no pensamos un poco en el futuro, luego puede que nos quedemos sin dinero para lo que realmente queremos.', '...but if we do not think a little about the future, we may run out of money for what we really want.'],
    ['En la actividad, fuiste tomando decisiones semana a semana pero sin tener una estrategia clara.', 'In the activity, you made decisions week by week but without a clear strategy.'],
    ['¿Te imaginas lo que podría pasar si, desde el principio, tuvieras una estrategia definida?', 'Can you imagine what could happen if, from the start, you had a defined strategy?'],
    ['Puedes ahorrarlo todo, pero sin disfrutar de nada...', 'You can save everything, but without enjoying anything...'],
    ['Puedes ahorrar lo que te sobre después de haber disfrutado...', 'You can save what is left after enjoying...'],
    ['Puedes guardar una parte cada semana para ahorrar y el resto para disfrutar...', 'You can save a part each week and use the rest to enjoy...'],
    ['O puedes dividir tú dinero en montoncitos, cada uno para una cosa diferente...', 'Or you can split your money into small piles, each one for a different purpose...'],
    ['¡Ahora te toca decidir a ti! Si pudieras elegir tu propia estrategia para ahorrar... ¿cuál te gustaría más?', 'Now it is your turn to decide! If you could choose your own savings strategy... which one would you like most?'],
    ['¿Qué estrategia usarías? O invéntate tu estrategia ideal para tí.', 'What strategy would you use? Or invent your ideal strategy.'],
    ['¡Pues aquí ha terminado la clase de hoy!', 'Today’s class ends here!'],
    ['Esperamos que te haya gustado y que hayas aprendido por qué es tan importante ahorrar.', 'We hope you liked it and learned why saving is so important.'],
    ['Ahora contesta 3 preguntas ¡Queremos saber tu opinión de esta clase!', 'Now answer 3 questions. We want your opinion about this class!'],
    ['Después de la clase, del 1 al 10, ¿cómo de seguro te sientes para administrar tu paga?', 'After this class, from 1 to 10, how confident do you feel managing your allowance?'],
    ['¿Qué es lo que MÁS te ha gustado de la clase?', 'What did you like MOST about the class?'],
    ['¿Cómo mejorarías la clase?', 'How would you improve the class?'],
    ['¡Hola de nuevo!', 'Hello again!'],
    ['El tema de hoy es la deuda. Pero antes de nada te lanzo una pregunta...', 'Today’s topic is debt. But first, let me ask you a question...'],
    ['¿Es lo mismo prestar que donar?', 'Is lending the same as donating?'],
    ['¡No es lo mismo! Cuando das dinero sin esperar que te lo devuelvan, eso es un regalo o una donación.', 'It is not the same! When you give money without expecting it back, that is a gift or donation.'],
    ['Pero cuando prestas dinero, esperas que la otra persona te lo devuelva en un tiempo pactado.', 'But when you lend money, you expect the other person to pay it back in an agreed time.'],
    ['La clave está en la promesa: Si es un regalo, no esperas nada, si es un préstamo, esperas que te lo devuelvan.', 'The key is the promise: if it is a gift, you expect nothing back; if it is a loan, you expect repayment.'],
    ['Teniendo clara esta diferencia...ahora sí que sí vamos a hablar de la deuda, un concepto clave en finanzas.', 'Now that this difference is clear, we can truly talk about debt, a key concept in finance.'],
    ['A veces, queremos comprar algo antes de haber ahorrado suficiente dinero porque somos impacientes...', 'Sometimes we want to buy something before saving enough money because we are impatient...'],
    ['Podemos esperar y ahorrar...', 'We can wait and save...'],
    ['O pedir prestado y devolverlo más adelante cuando podamos.', 'Or borrow and pay it back later when we can.'],
    ['Pero también puede darse la situación ¡al revés!', 'But the opposite situation can also happen!'],
    ['Por ejemplo: si tú tienes dinero ahorrado y una amiga no, puedes prestarle el dinero y esperar que te lo devuelva.', 'For example: if you have savings and a friend does not, you can lend her money and expect repayment.'],
    ['Así nace la ✨DEUDA✨: cuando pedimos prestado dinero con la promesa de devolverlo en el futuro.', 'That is how ✨DEBT✨ is born: when we borrow money promising to repay in the future.'],
    ['La deuda es una herramienta útil: nos permite usar dinero que no tenemos hoy... pero hay que tener cuidado.', 'Debt is a useful tool: it lets us use money we do not have today... but we must be careful.'],
    ['Sección 1: \nDeuda buena vs\nDeuda mala', 'Section 1: \nGood debt vs\nBad debt'],
    ['Existen dos tipos de deudas...', 'There are two kinds of debt...'],
    ['La deuda buena...', 'Good debt...'],
    ['Y la deuda mala.', 'And bad debt.'],
    ['Pero… ¿Cómo diferenciamos entre una deuda buena o mala?', 'But... how do we tell good debt from bad debt?'],
    ['¿Sabrías decir cuál es la diferencia entre deuda buena y deuda mala?', 'Could you explain the difference between good debt and bad debt?'],
    ['Pues vamos a verlo con los ejemplos de Carlos y Ana.', 'Let us see it with examples from Carlos and Ana.'],
    ['Carlos quiere una consola de videojuegos que cuesta 500 €. No tiene dinero suficiente ahorrado, así que pide prestado y promete devolverlo en 6 meses.', 'Carlos wants a game console that costs €500. He does not have enough saved, so he borrows and promises to repay in 6 months.'],
    ['La consola solo la usa para divertirse. Ahora tiene que devolver el dinero poco a poco, y se queda sin margen para otros gastos importantes...', 'He only uses the console for fun. Now he must repay little by little and has less room for important expenses...'],
    ['Esto es un ejemplo de deuda mala: los caprichos no son una buena razón para pedir dinero.', 'This is an example of bad debt: whims are not a good reason to borrow money.'],
    ['Otro ejemplo: Ana quiere empezar un pequeño negocio de pulseras...', 'Another example: Ana wants to start a small bracelet business...'],
    ['Pide prestado 50 € para comprar materiales, hace pulseras y las vende por 100 € en total.', 'She borrows €50 to buy materials, makes bracelets, and sells them for €100 total.'],
    ['Esto es una deuda buena: pidió prestado para generar más dinero y ganó más de lo que tenía que devolver.', 'This is good debt: she borrowed to generate more money and earned more than she had to repay.'],
    ['La deuda buena te ayuda a generar más dinero. La deuda mala te quita dinero y te deja con menos opciones.', 'Good debt helps you generate more money. Bad debt takes money away and leaves you with fewer options.'],
    ['¿Veis la diferencia? Vamos a poner estos conocimientos en práctica con una actividad. ¡Manos a la obra!', 'Do you see the difference? Let us put this into practice with an activity. Let’s do it!'],
    ['¡Hola! Soy Osi, y en esta actividad me vas a guiar a tomar una serie de decisiones...', 'Hi! I am Osi, and in this activity you will guide me through several decisions...'],
    ['¿Me ayudas a gestionar mi dinero durante 8 semanas?', 'Will you help me manage my money for 8 weeks?'],
    ['¡¡¡¡Ojo!!!! A Osi le gusta hacer planes y cumplir con lo que debe.', 'Watch out! Osi likes making plans and keeping commitments.'],
    ['Osi tiene un medidor de su impaciencia.', 'Osi has an impatience meter.'],
    ['Si Osi hace lo que se le propone la barra de impaciencia bajará.', 'If Osi follows the proposed plan, the impatience bar will go down.'],
    ['Si Osi no hace el plan, la barra de impaciencia subirá.', 'If Osi does not follow the plan, the impatience bar will rise.'],
    ['El objetivo es no sobrepasar el límite, mientras gestionas el dinero de Osi.', 'The goal is not to exceed the limit while managing Osi’s money.'],
    ['Vamos a comenzar con un pequeño tutorial para que veas cómo funciona todo.', 'We will start with a short tutorial so you can see how everything works.'],
    ['Intenta rechazar el plan', 'Try rejecting the plan'],
    ['Intenta pagar para hacer el plan', 'Try paying to follow the plan'],
    ['Intenta pedir un préstamo', 'Try requesting a loan'],
    ['Intenta devolver un préstamo', 'Try repaying a loan'],
    ['Ahora si vamos con la actividad, ¡manos a la obra!', 'Now let’s start the activity, hands on!'],
    ['Mis amigos me proponen ir al cine. La entrada cuesta 10 €. ¿Qué hago?', 'My friends suggest going to the movies. The ticket costs €10. What should I do?'],
    ['Recibes tu primera paga semanal.', 'You receive your first weekly allowance.'],
    ['Se me ha roto el móvil y repararlo cuesta 22 €. ¿Qué es lo mejor que puedo hacer?', 'My phone broke and fixing it costs €22. What is the best thing to do?'],
    ['Recibes tu segunda paga semanal.', 'You receive your second weekly allowance.'],
    ['Tengo una oportunidad de negocio: montar un puesto de limonada que cuesta 45 € y me puede dar 52 € la próxima semana.', 'I have a business opportunity: a lemonade stand costing €45 that could return €52 next week.'],
    ['Hoy recibes tu tercera paga semanal.', 'Today you receive your third weekly allowance.'],
    ['He visto una sudadera exclusiva que cuesta 28€ y quiero comprarla', 'I saw an exclusive hoodie that costs €28 and I want to buy it.'],
    ['Un amigo te pide 6 € para una supuesta emergencia y dice que te lo devuelve en 1 semana. ¿Se lo das?', 'A friend asks you for €6 for an emergency and says they will pay it back in 1 week. Do you lend it?'],
    ['La quinta paga semanal. ¡Estamos cerca del final!', 'The fifth weekly allowance. We are close to the end!'],
    ['He visto un nuevo juego que todos mis amigos tienen. Cuesta 18 € y tengo muchas ganas de jugarlo con ellos.', 'I saw a new game that all my friends have. It costs €18 and I really want to play with them.'],
    ['La sexta paga semanal. ¡Queda poco!', 'The sixth weekly allowance. Almost done!'],
    ['Tu amigo te devuelve el préstamo.', 'Your friend pays back the loan.'],
    ['Estás enfermo y necesitas comprar medicinas, cuestan 52€.', 'You are sick and need to buy medicine; it costs €52.'],
    ['Resumen de la semana 7 y paga semanal.', 'Week 7 summary and weekly allowance.'],
    ['¿Qué tal la actividad? Espero que te haya gustado ayudar a Osi a gestionar la deuda y la impaciencia.', 'How was the activity? I hope you liked helping Osi manage debt and impatience.'],
    ['Vamos ahora a hacer una miniactividad. ¿Serás capaz de ordenar bien las frases?', 'Now we will do a mini activity. Can you order the sentences correctly?'],
    ['Si te hago la misma pregunta que al principio, ¿sabrías responder con lo que has aprendido?', 'If I ask the same question as at the beginning, could you answer with what you learned?'],
    ['Después de la clase, ¿sabrías decirme un ejemplo de deuda buena y otro de deuda mala?', 'After class, could you give one example of good debt and one of bad debt?'],
    ['Esperamos que te haya gustado y que hayas aprendido a usar la deuda de forma inteligente.', 'We hope you liked it and learned to use debt wisely.'],
    ['Después de lo aprendido hoy, ¿cómo de seguro te sientes para saber si pedir dinero prestado es una buena decisión o una deuda mala?', 'After what you learned today, how confident are you in deciding whether borrowing is a good choice or bad debt?'],
    ['PAUSA', 'PAUSE'],
    ['UMBRAL', 'THRESHOLD'],
    ['Poco', 'Low'],
    ['Mucho', 'High'],
    ['Bajo', 'Low'],
    ['Alto', 'High']
  ]);
  const normalizeTextKey = (v) => String(v || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  const NORMALIZED_TEXT_MAP = new Map(
    Array.from(TEXT_MAP.entries()).map(([k, v]) => [normalizeTextKey(k), v])
  );

  const PAGE_TRANSLATORS = {};

  function normalizeLang(value) {
    const lang = String(value || '').toLowerCase().trim();
    if (!lang) return '';
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('es')) return 'es';
    return '';
  }

  function getFromQuery() {
    try {
      const p = new URLSearchParams(window.location.search);
      return normalizeLang(p.get('lang'));
    } catch (_) {
      return '';
    }
  }

  function getStored() {
    try {
      return normalizeLang(localStorage.getItem(STORAGE_KEY));
    } catch (_) {
      return '';
    }
  }

  function resolveInitialLang() {
    return getFromQuery() || getStored() || normalizeLang(document.documentElement.lang) || FALLBACK;
  }

  let currentLang = resolveInitialLang();
  if (!SUPPORTED.includes(currentLang)) currentLang = FALLBACK;

  function updateHtmlLang() {
    document.documentElement.lang = currentLang;
  }

  function persistLang() {
    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (_) {}
  }

  function getPath(obj, path) {
    return String(path || '')
      .split('.')
      .filter(Boolean)
      .reduce((acc, key) => (acc && Object.prototype.hasOwnProperty.call(acc, key) ? acc[key] : undefined), obj);
  }

  function format(text, vars) {
    return String(text).replace(/\{(\w+)\}/g, (_m, key) => {
      if (!vars || !Object.prototype.hasOwnProperty.call(vars, key)) return `{${key}}`;
      return String(vars[key]);
    });
  }

  function t(key, vars) {
    const fromLang = getPath(DICT[currentLang], key);
    const fromFallback = getPath(DICT[FALLBACK], key);
    const val = fromLang != null ? fromLang : (fromFallback != null ? fromFallback : key);
    return format(val, vars);
  }

  function mapText(text) {
    const src = String(text || '');
    if (!src) return src;
    if (currentLang !== 'en') return src;
    const normalized = normalizeTextKey(src);
    let m = null;
    m = normalized.match(/^Te faltan\s+(\d+)\s+monedas$/i);
    if (m) return `You need ${m[1]} more coins`;
    m = normalized.match(/^Stock:\s*(\d+)$/i);
    if (m) return `Stock: ${m[1]}`;
    m = normalized.match(/^Comprado:\s*(\d+)\s*\/\s*(\d+)$/i);
    if (m) return `Purchased: ${m[1]}/${m[2]}`;
    m = normalized.match(/^Compra realizada:\s+(.+)\.$/i);
    if (m) return `Purchase completed: ${m[1]}.`;
    m = normalized.match(/^Has terminado con\s+(\d+)\s+fallo(s?)\.$/i);
    if (m) return `You finished with ${m[1]} mistake${m[1] === '1' ? '' : 's'}.`;
    m = normalized.match(/^Ganaste\s+(.+)\s+al final del dia\.$/i);
    if (m) return `You earned ${m[1]} at the end of the day.`;
    m = normalized.match(/^Perdiste\s+(.+)\s+al final del dia\.$/i);
    if (m) return `You lost ${m[1]} at the end of the day.`;
    m = normalized.match(/^Frase\s+(\d+)\s+de\s+(\d+)$/i);
    if (m) return `Phrase ${m[1]} of ${m[2]}`;
    m = normalized.match(/^Precio\s+(.+)\s+·\s+Cantidad\s+(.+)$/i);
    if (m) return `Price ${m[1]} · Quantity ${m[2]}`;
    m = normalized.match(/^El importe debe estar entre\s+(.+)\s+y\s+(.+)\.$/i);
    if (m) return `Amount must be between ${m[1]} and ${m[2]}.`;
    m = normalized.match(/^Las semanas deben estar entre\s+(.+)\s+y\s+(.+)\.$/i);
    if (m) return `Weeks must be between ${m[1]} and ${m[2]}.`;
    m = normalized.match(/^Importe entre\s+(.+)\s+y\s+(.+)\s+·\s+Semanas entre\s+(.+)\s+y\s+(.+)$/i);
    if (m) return `Amount between ${m[1]} and ${m[2]} · Weeks between ${m[3]} and ${m[4]}`;
    m = normalized.match(/^Importe entre\s+(.+)\s+y\s+(.+)\s+Â·\s+Semanas entre\s+(.+)\s+y\s+(.+)$/i);
    if (m) return `Amount between ${m[1]} and ${m[2]} · Weeks between ${m[3]} and ${m[4]}`;
    m = normalized.match(/^Necesitas\s+(.+)\s+para poder prestar\.$/i);
    if (m) return `You need ${m[1]} to be able to lend.`;
    m = normalized.match(/^Te faltan\s+(.+)\s+para poder pagar\.$/i);
    if (m) return `You need ${m[1]} more to be able to pay.`;
    m = normalized.match(/^Te faltan\s+(.+)\s+para poder prestar\s+(.+)\.$/i);
    if (m) return `You need ${m[1]} more to be able to lend ${m[2]}.`;
    m = normalized.match(/^Recibir(?:ás|as|Ã¡s)\s+1\s*moneda\s+si\s+Luc(?:ía|ia|Ã­a)\s+consigue\s+la\s+Bici\s+y\s+no\s+est(?:á|a|Ã¡)\s+muy\s+triste$/i);
    if (m) return 'You will receive 1 if Lucia gets the bike and is not too sad';
    m = normalized.match(/^Recibir(?:ás|as|Ã¡s)\s+1\s+si\s+Luc(?:ía|ia|Ã­a)\s+consigue\s+la\s+Bici\s+y\s+no\s+est(?:á|a|Ã¡)\s+muy\s+triste$/i);
    if (m) return 'You will receive 1 if Lucia gets the bike and is not too sad';
    m = normalized.match(/^Saldo tras pedir:\s*(.+)$/i);
    if (m) return `Balance after loan: ${m[1]}`;
    m = normalized.match(/^Vas a devolver el préstamo ID\s+(.+)\.\s+Importe:\s+(.+)$/i);
    if (m) return `You are going to repay loan ID ${m[1]}. Amount: ${m[2]}`;
    m = normalized.match(/^Posible causa del evento:\s+(.+)$/i);
    if (m) return `Possible event cause: ${m[1]}`;
    m = normalized.match(/^Nivel\s+(\d+)\s+—\s+(.+)$/i);
    if (m) return `Level ${m[1]} — ${m[2]}`;
    m = normalized.match(/^Nivel\s+(\d+)$/i);
    if (m) return `Level ${m[1]}`;
    m = normalized.match(/^(.+)\s+compra a\s+(.+)\.$/i);
    if (m) return `${m[1]} buys at ${m[2]}.`;
    m = normalized.match(/^(.+)\s+se va:\s+muy caro\s+\(WTP\s+(.+)\)\.$/i);
    if (m) return `${m[1]} leaves: too expensive (WTP ${m[2]}).`;
    m = normalized.match(/^(.+)\s+se va:\s+sin stock\.$/i);
    if (m) return `${m[1]} leaves: out of stock.`;
    m = normalized.match(/^Merma:\s+(\d+)\s+helados sin vender\.\s+Penalización\s+(.+)\.$/i);
    if (m) return `Waste: ${m[1]} unsold ice creams. Penalty ${m[2]}.`;
    m = normalized.match(/^Frase\s+(.+)\s+de\s+(.+)$/i);
    if (m) return `Phrase ${m[1]} of ${m[2]}`;
    if (/^Saldo tras pedir:\s*€/.test(normalized)) {
      return normalized.replace('Saldo tras pedir:', 'Balance after loan:');
    }
    if (TEXT_MAP.has(src)) return TEXT_MAP.get(src);
    if (NORMALIZED_TEXT_MAP.has(normalized)) return NORMALIZED_TEXT_MAP.get(normalized);
    return src;
  }

  function translateAttr(el, attr) {
    if (!el || !attr || !el.hasAttribute(attr)) return;
    const cur = el.getAttribute(attr);
    const next = mapText(cur);
    if (next !== cur) el.setAttribute(attr, next);
  }

  function translateNodeText(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const touched = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const val = node.nodeValue;
      if (!val || !val.trim()) continue;
      const next = mapText(val.trim());
      if (next !== val.trim()) touched.push([node, val.replace(val.trim(), next)]);
    }
    touched.forEach(([node, val]) => {
      node.nodeValue = val;
    });
  }

  function translateDom(root) {
    if (!root || currentLang !== 'en') return;
    translateNodeText(root);
    const els = root.querySelectorAll ? root.querySelectorAll('*') : [];
    els.forEach((el) => {
      translateAttr(el, 'aria-label');
      translateAttr(el, 'title');
      translateAttr(el, 'placeholder');
      translateAttr(el, 'alt');
    });
  }

  function translateTextNode(node) {
    if (!node) return;
    const val = String(node.nodeValue || '');
    if (!val.trim()) return;
    const mapped = mapText(val.trim());
    if (mapped === val.trim()) return;
    node.nodeValue = val.replace(val.trim(), mapped);
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = value;
  }

  function setAttr(selector, attr, value) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.setAttribute(attr, value);
  }

  function translatePageBase() {
    document.title = mapText(document.title);
    translateDom(document.body);
  }

  function applyPageSpecific() {
    const page = (document.documentElement.getAttribute('data-page') || '').toLowerCase();
    const fn = PAGE_TRANSLATORS[page];
    if (typeof fn === 'function') fn();
  }

  function apply() {
    updateHtmlLang();
    translatePageBase();
    applyPageSpecific();
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: currentLang } }));
  }

  function setLang(lang) {
    const next = normalizeLang(lang);
    if (!SUPPORTED.includes(next)) return;
    currentLang = next;
    persistLang();
    updateHtmlLang();
  }

  function getLang() {
    return currentLang;
  }

  function toggleLang() {
    setLang(currentLang === 'es' ? 'en' : 'es');
    return currentLang;
  }

  function registerPageTranslator(pageId, fn) {
    const key = String(pageId || '').toLowerCase().trim();
    if (!key || typeof fn !== 'function') return;
    PAGE_TRANSLATORS[key] = fn;
  }

  // Translate slide payload values without touching logic keys.
  const SLIDE_TEXT_KEYS = new Set([
    'text', 'pregunta', 'placeholder', 'titulo', 'title', 'actividad',
    'introtitle', 'introtext', 'introbuttontext', 'submittext', 'skiptext',
    'evaltext', 'continuetext', 'description', 'descripcion', 'meaning',
    'term', 'textok', 'textko', 'oktext', 'kotext', 'alt', 'name', 'cause'
  ]);
  const SLIDE_TEXT_ARRAY_KEYS = new Set(['guiones', 'options', 'opciones', 'phrases', 'frases', 'labels']);

  function translateSlideValue(value, keyName) {
    if (value == null) return value;
    if (typeof value === 'string') {
      if (!keyName) return value;
      const k = String(keyName).toLowerCase();
      if (SLIDE_TEXT_KEYS.has(k)) return mapText(value);
      return value;
    }
    if (Array.isArray(value)) {
      const k = String(keyName || '').toLowerCase();
      if (!SLIDE_TEXT_ARRAY_KEYS.has(k)) {
        return value.map((item) => translateSlideValue(item, null));
      }
      return value.map((item) => {
        if (typeof item === 'string') return mapText(item);
        if (item && typeof item === 'object') {
          const out = Array.isArray(item) ? [] : {};
          Object.keys(item).forEach((inner) => {
            out[inner] = translateSlideValue(item[inner], inner);
          });
          return out;
        }
        return item;
      });
    }
    if (typeof value === 'object') {
      const out = Array.isArray(value) ? [] : {};
      Object.keys(value).forEach((k) => {
        out[k] = translateSlideValue(value[k], k);
      });
      return out;
    }
    return value;
  }

  window.I18N = {
    t,
    tr: mapText,
    setLang,
    toggleLang,
    getLang,
    apply,
    translateDom,
    registerPageTranslator,
    translateSlideValue,
    keys: { STORAGE_KEY }
  };

  document.addEventListener('DOMContentLoaded', () => {
    apply();

    const obs = new MutationObserver((mutations) => {
      if (currentLang !== 'en') return;
      mutations.forEach((m) => {
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) translateDom(node);
            if (node instanceof Text) translateTextNode(node);
          });
          return;
        }
        if (m.type === 'characterData') {
          translateTextNode(m.target);
          return;
        }
        if (m.type === 'attributes' && m.target instanceof HTMLElement) {
          translateAttr(m.target, m.attributeName);
        }
      });
    });
    if (document.body) {
      obs.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['aria-label', 'title', 'placeholder', 'alt']
      });
    }
  });

  registerPageTranslator('menu', () => {
    if (currentLang !== 'en') return;
    setText('a.card--clase span', 'Class');
    setText('a.card--actividades span', 'Activities');
    setText('a.card--ranking span', 'Ranking');
    setAttr('#generalSurveyStar', 'aria-label', 'General survey');
    setAttr('#generalSurveyStar', 'title', 'General survey');
  });

  registerPageTranslator('clase', () => {
    if (currentLang !== 'en') return;
    setAttr('#btn-next', 'aria-label', 'Next');
    setAttr('#btn-next', 'title', 'Next');
    const loadBtn = document.getElementById('classLoadBtn');
    if (loadBtn) loadBtn.textContent = 'Load';
  });

  registerPageTranslator('splash', () => {
    if (currentLang !== 'en') return;

    document.title = 'Classroom Access - ADAMIS';
    setText('.hero p', 'Select the appropriate access to enter the platform.');

    const containers = document.querySelectorAll('.access-grid .container');
    const studentCard = containers[0];
    const teacherCard = containers[1];

    if (studentCard) {
      const title = studentCard.querySelector('h2');
      const helper = studentCard.querySelector('.helper');
      const password = studentCard.querySelector('input[name="password"]');
      const submit = studentCard.querySelector('button[type="submit"]');
      const error = studentCard.querySelector('#studentError');
      const schoolSelect = studentCard.querySelector('select[name="centro"]');
      const schoolPlaceholder = studentCard.querySelector('select[name="centro"] option[value=""]');
      const schoolNote = studentCard.querySelector('[data-school-note]');

      if (title) title.textContent = 'Student Access';
      if (helper) helper.textContent = 'Student classroom access.';
      if (password) password.setAttribute('placeholder', 'Class password');
      if (submit) submit.textContent = 'Enter as student';
      if (error) error.textContent = 'Incorrect password';
      if (schoolPlaceholder) schoolPlaceholder.textContent = schoolSelect?.disabled ? 'No schools configured' : 'Select your school';
      if (schoolNote) schoolNote.textContent = 'Add names to the SCHOOL_OPTIONS constant in splash.html to populate this dropdown.';
    }

    if (teacherCard) {
      const title = teacherCard.querySelector('h2');
      const helper = teacherCard.querySelector('.helper');
      const password = teacherCard.querySelector('input[name="password"]');
      const submit = teacherCard.querySelector('button[type="submit"]');
      const error = teacherCard.querySelector('#teacherError');
      const schoolSelect = teacherCard.querySelector('select[name="centro"]');
      const schoolPlaceholder = teacherCard.querySelector('select[name="centro"] option[value=""]');
      const schoolNote = teacherCard.querySelector('[data-school-note]');

      if (title) title.textContent = 'Teacher Access';
      if (helper) helper.textContent = 'Student monitoring and progress view.';
      if (password) password.setAttribute('placeholder', 'Teacher password');
      if (submit) submit.textContent = 'Enter as teacher';
      if (error) error.textContent = 'Incorrect teacher password';
      if (schoolPlaceholder) schoolPlaceholder.textContent = schoolSelect?.disabled ? 'No schools configured' : 'Select your school';
      if (schoolNote) schoolNote.textContent = 'Add names to the SCHOOL_OPTIONS constant in splash.html to populate this dropdown.';
    }
  });
})();
