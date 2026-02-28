// data/palabras.js
// Dataset por idioma para Wordle.
window.PALABRAS_BY_LANG = {
  es: [
    ['DEUDA', 'Dinero que debes a alguien.'],
    ['RENTA', 'Dinero que recibes de forma periodica (trabajo o inversion).'],
    ['BANCO', 'Entidad que guarda dinero y ofrece prestamos.'],
    ['BONOS', 'Prestamos a gobiernos o empresas a cambio de intereses.'],
    ['SALDO', 'Dinero disponible en tu cuenta.'],
    ['FONDO', 'Dinero reunido para invertir en conjunto.'],
    ['CUOTA', 'Pago periodico de un prestamo o servicio.'],
    ['EURO', 'Moneda usada para pagar en muchos paises de Europa.'],
    ['PAGAR', 'Entregar dinero a cambio de algo.'],
    ['COSTE', 'Lo que cuesta un producto o servicio.'],
    ['COBRO', 'Dinero que recibes por trabajo o venta.'],
    ['RATIO', 'Relacion entre dos cantidades, por ejemplo deuda e ingresos.'],
    ['INVERSION', 'Dinero destinado a obtener beneficios futuros.'],
    ['AHORRO', 'Diferencia entre ingresos y gastos que no se destina al consumo.']
  ],
  en: [
    ['DEBT', 'Money that you owe to someone.'],
    ['RENT', 'Regular income from work or investments.'],
    ['BANK', 'Institution that stores money and offers loans.'],
    ['BONDS', 'Loans to governments or companies in exchange for interest.'],
    ['BALANCE', 'Money currently available in your account.'],
    ['FUND', 'Money pooled together for investment purposes.'],
    ['INSTALLMENT', 'Periodic payment of a loan or service.'],
    ['EURO', 'Currency used in many European countries.'],
    ['PAY', 'To give money in exchange for something.'],
    ['COST', 'Amount required to buy a product or service.'],
    ['INCOME', 'Money you receive from work or sales.'],
    ['RATIO', 'Relationship between two quantities, such as debt and income.'],
    ['INVESTMENT', 'Money allocated to generate future returns.'],
    ['SAVINGS', 'Part of income kept instead of being spent.']
  ]
};

// Backward compatibility
window.PALABRAS = window.PALABRAS_BY_LANG.es.slice();
