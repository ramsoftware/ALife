/* Autor: Rafael Alberto Moreno Parra
Fecha: Octubre de 2022
URL: http://darwin.50webs.com
https://github.com/ramsoftware
*/

class PiezaEvl4 {
	constructor(PosResultado, Funcion, PosValorA, Operador, PosValorB) {
		this.PosResultado = PosResultado; /* Posición donde se almacena el valor que genera la pieza al evaluarse */
		this.Funcion = Funcion; /* Código de la función 0:seno, 1:coseno, 2:tangente, 3: valor absoluto, 4: arcoseno, 5: arcocoseno, 6: arcotangente, 7: logaritmo natural, 8: valor tope, 9: exponencial, 10: raíz cuadrada */
		this.PosValorA = PosValorA; /* Posición donde se almacena la primera parte de la pieza */
		this.Operador = Operador; /* 0 suma 1 resta 2 multiplicación 3 división 4 potencia */
		this.PosValorB = PosValorB; /* Posición donde se almacena la segunda parte de la pieza */
	}
}

class ParteEvl4 {
	constructor(TipoParte, Valor) {
		/* Constantes de los diferentes tipos de datos que tendrán las piezas */
		this.ESFUNCION = 1;
		this.ESOPERADOR = 4;
		this.ESNUMERO = 5;
		this.ESVARIABLE = 6;

		this.Funcion = -1; /* Código de la función 0:seno, 1:coseno, 2:tangente, 3: valor absoluto, 4: arcoseno, 5: arcocoseno, 6: arcotangente, 7: logaritmo natural, 8: valor tope, 9: exponencial, 10: raíz cuadrada */
		this.Operador = -1; /* + suma - resta * multiplicación / división ^ potencia */
		this.posNumero = -1; /* Posición en lista de valores del número literal, por ejemplo: 3.141592 */
		this.posVariable = -1; /* Posición en lista de valores del valor de la variable algebraica */
		this.posAcumula = -1; /* Posición en lista de valores del valor de la pieza. Por ejemplo:
				3 + 2 / 5  se convierte así:
				|3| |+| |2| |/| |5|
				|3| |+| |A|  A es un identificador de acumulador */

		this.Tipo = TipoParte; /* Acumulador, función, paréntesis que abre, paréntesis que cierra, operador, número, variable */
		switch (TipoParte) {
			case this.ESFUNCION:
				this.Funcion = Valor;
				break;
			case this.ESOPERADOR:
				this.Operador = Valor;
				break;
			case this.ESNUMERO:
				this.posNumero = Valor;
				break;
			case this.ESVARIABLE:
				this.posVariable = Valor;
				break;
		}

	}
}


class Evaluador4{

	constructor(){
		/* Constantes de los diferentes tipos de datos que tendrán las partes */
		this.ESFUNCION = 1;
		this.ESPARABRE = 2;
		this.ESPARCIERRA = 3;
		this.ESOPERADOR = 4;
		this.ESNUMERO = 5;
		this.ESVARIABLE = 6;
		this.ESACUMULA = 7;

		/* Donde guarda los valores de variables, constantes y piezas */
		this.Valores = [];
		for (let cont=0; cont<=25; cont++) this.Valores.push(0);

		/* Listado de partes en que se divide la expresión
		   Toma una expresión, por ejemplo: 1.68 + sen( 3 / x ) * ( 2.9 ^ 2 - 9 ) y la divide en partes así:
		   [1.68] [+] [sen(] [3] [/] [x] [)] [*] [(] [2.9] [^] [2] [-] [9] [)]
		   Cada parte puede tener un número, un operador, una función, un paréntesis que abre o un paréntesis que cierra */
		this.Partes = [];

		/* Listado de piezas que ejecutan
			Toma las partes y las divide en piezas con la siguiente estructura:
			acumula = funcion  numero/variable/acumula  operador  numero/variable/acumula
			Siguiendo el ejemplo anterior sería:
			A =  2.9  ^  2
			B =  A  -  9
			C =  seno ( 3  /  x )
			D =  C  *  B
			E =  1.68 + D

		   Esas piezas se evalúan de arriba a abajo y así se interpreta la ecuación */
		this.Piezas = [];

		/* Mensajes de error de sintaxis */
		this.ErrorSintaxis = [
			'0. Caracteres no permitidos. Ejemplo: 3$5+2',
			'1. Un número seguido de una letra. Ejemplo: 2q-(*3)',
			'2. Un número seguido de un paréntesis que abre. Ejemplo: 7-2(5-6)',
			'3. Doble punto seguido. Ejemplo: 3..1',
			'4. Punto seguido de operador. Ejemplo: 3.*1',
			'5. Un punto y sigue una letra. Ejemplo: 3+5.w-8',
			'6. Punto seguido de paréntesis que abre. Ejemplo: 2-5.(4+1)*3',
			'7. Punto seguido de paréntesis que cierra. Ejemplo: 2-(5.)*3',
			'8. Un operador seguido de un punto. Ejemplo: 2-(4+.1)-7',
			'9. Dos operadores estén seguidos. Ejemplo: 2++4, 5-*3',
			'10. Un operador seguido de un paréntesis que cierra. Ejemplo: 2-(4+)-7',
			'11. Una letra seguida de número. Ejemplo: 7-2a-6',
			'12. Una letra seguida de punto. Ejemplo: 7-a.-6',
			'13. Un paréntesis que abre seguido de punto. Ejemplo: 7-(.4-6)',
			'14. Un paréntesis que abre seguido de un operador. Ejemplo: 2-(*3)',
			'15. Un paréntesis que abre seguido de un paréntesis que cierra. Ejemplo: 7-()-6',
			'16. Un paréntesis que cierra y sigue un número. Ejemplo: (3-5)7',
			'17. Un paréntesis que cierra y sigue un punto. Ejemplo: (3-5).',
			'18. Un paréntesis que cierra y sigue una letra. Ejemplo: (3-5)t',
			'19. Un paréntesis que cierra y sigue un paréntesis que abre. Ejemplo: (3-5)(4*5)',
			'20. Hay dos o más letras seguidas (obviando las funciones)',
			'21. Los paréntesis están desbalanceados. Ejemplo: 3-(2*4))',
			'22. Doble punto en un número de tipo real. Ejemplo: 7-6.46.1+2',
			'23. Paréntesis que abre no corresponde con el que cierra. Ejemplo: 2+3)-2*(4',
			'24. Inicia con operador. Ejemplo: +3*5',
			'25. Finaliza con operador. Ejemplo: 3*5*',
			'26. Letra seguida de paréntesis que abre (obviando las funciones). Ejemplo: 4*a(6-2)*',
		];
	}

	/* Analiza la expresión */
	Analizar(ExpresionOriginal) {
		this.Partes.length = 0;
		this.Piezas.length = 0;

		/* Chequea que la expresión sea sintácticamente correcta */
		let Sintaxis = this.EvaluaSintaxis(ExpresionOriginal);
		if (Sintaxis === -1) {
			/* Si es correcta, entonces se transforma, se divide en partes y luego en piezas */

			/* Primero a minúsculas y encerrado entre paréntesis */
			let Transformada = "(" + ExpresionOriginal.toLowerCase() + ")";

			/* Reemplaza las funciones de tres letras por una letra mayúscula. Cambia los )) por )+0) porque es requerido al crear las piezas */
			Transformada = Transformada.replaceAll(" ", "").replaceAll("sen", "A").replaceAll("cos", "B").replaceAll("tan", "C").replaceAll("abs", "D").replaceAll("asn", "E").replaceAll("acs", "F").replaceAll("atn", "G").replaceAll("log", "H").replaceAll("cei", "I").replaceAll("exp", "J").replaceAll("sqr", "K").replaceAll("))", ")+0)");

			this.CrearPartes(Transformada);
			this.CrearPiezas();
		}
		return Sintaxis;
	}

	/* Retorna mensaje de error sintáctico */
	MensajeError(CodigoError) {
		return this.ErrorSintaxis[CodigoError];
	}

	/* Da valor a las variables que tendrá la expresión algebraica */
	DarValorVariable(varAlgebra, Valor) {
		this.Valores[varAlgebra.charCodeAt(0) - 'a'.charCodeAt(0)] = Valor;
	}

	/* Evalúa la expresión convertida en piezas */
	Evaluar() {
		let Resultado = 0;

		/* Va de pieza en pieza */
		let TotalPiezas = this.Piezas.length;
		for (let Posicion = 0; Posicion < TotalPiezas; Posicion++) {
			let tmpPieza = this.Piezas[Posicion];

			switch (tmpPieza.Operador) {
				case 0: Resultado = this.Valores[tmpPieza.PosValorA] + this.Valores[tmpPieza.PosValorB]; break;
				case 1: Resultado = this.Valores[tmpPieza.PosValorA] - this.Valores[tmpPieza.PosValorB]; break;
				case 2: Resultado = this.Valores[tmpPieza.PosValorA] * this.Valores[tmpPieza.PosValorB]; break;
				case 3: Resultado = this.Valores[tmpPieza.PosValorA] / this.Valores[tmpPieza.PosValorB]; break;
				default: Resultado = Math.pow(this.Valores[tmpPieza.PosValorA], this.Valores[tmpPieza.PosValorB]); break;
			}
			
			switch (tmpPieza.Funcion) {
				case 0: Resultado = Math.sin(Resultado); break;
				case 1: Resultado = Math.cos(Resultado); break;
				case 2: Resultado = Math.tan(Resultado); break;
				case 3: Resultado = Math.abs(Resultado); break;
				case 4: Resultado = Math.asin(Resultado); break;
				case 5: Resultado = Math.acos(Resultado); break;
				case 6: Resultado = Math.atan(Resultado); break;
				case 7: Resultado = Math.log(Resultado); break;
				case 8: Resultado = Math.ceil(Resultado); break;
				case 9: Resultado = Math.exp(Resultado); break;
				case 10: Resultado = Math.sqrt(Resultado); break;
			}

			this.Valores[tmpPieza.PosResultado] = Resultado;
		}
		return Resultado;
	}

	/* Divide la expresión en partes */
	CrearPartes(Expresion) {
		/* Va de caracter en caracter */
		let Numero = "";
		for (let Posicion = 0; Posicion < Expresion.length; Posicion++) {
			let Letra = Expresion[Posicion];

			/* Si es un número lo va acumulando en una cadena */
			if ((Letra >= '0' && Letra <= '9') || Letra === '.') {
				Numero += Letra;
			}
			/* Si es un operador entonces agrega número (si existía) */
			else if (Letra === '+' || Letra === '-' || Letra === '*' || Letra === '/' || Letra === '^') {
				if (Numero.length > 0) {
					this.Valores.push(parseFloat(Numero));
					this.Partes.push(new ParteEvl4(this.ESNUMERO, this.Valores.length - 1));
					Numero = "";
				}
				switch (Letra) {
					case '+': this.Partes.push(new ParteEvl4(this.ESOPERADOR, 0)); break;
					case '-': this.Partes.push(new ParteEvl4(this.ESOPERADOR, 1)); break;
					case '*': this.Partes.push(new ParteEvl4(this.ESOPERADOR, 2)); break;
					case '/': this.Partes.push(new ParteEvl4(this.ESOPERADOR, 3)); break;
					case '^': this.Partes.push(new ParteEvl4(this.ESOPERADOR, 4)); break;
				}
			}
			/* Si es variable */
			else if (Letra >= 'a' && Letra <= 'z') {
				this.Partes.push(new ParteEvl4(this.ESVARIABLE, Letra.charCodeAt(0) - 'a'.charCodeAt(0)));
			}
			/* Si es una función (seno, coseno, tangente, ...) */
			else if (Letra >= 'A' && Letra <= 'L') {
				this.Partes.push(new ParteEvl4(this.ESFUNCION, Letra.charCodeAt(0) - 'A'.charCodeAt(0)));
				Posicion++;
			}
			/* Si es un paréntesis que abre */
			else if (Letra === '(') {
				this.Partes.push(new ParteEvl4(this.ESPARABRE, 0));
			}
			/* Si es un paréntesis que cierra */
			else {
				if (Numero.length > 0) {
					this.Valores.push(parseFloat(Numero));
					this.Partes.push(new ParteEvl4(this.ESNUMERO, this.Valores.length - 1));
					Numero = "";
				}
				/* Si sólo había un número o variable dentro del paréntesis le agrega + 0 (por ejemplo:  sen(x) o 3*(2) ) */
				if (this.Partes[this.Partes.length - 2].Tipo === this.ESPARABRE || this.Partes[this.Partes.length - 2].Tipo === this.ESFUNCION) {
					this.Partes.push(new ParteEvl4(this.ESOPERADOR, 0));
					this.Valores.push(0);
					this.Partes.push(new ParteEvl4(this.ESNUMERO, this.Valores.length - 1));
				}
				this.Partes.push(new ParteEvl4(this.ESPARCIERRA, 0));
			}
		}
	}

	/* Convierte las partes en las piezas finales de ejecución */
	CrearPiezas() {
		let Contador = this.Partes.length - 1;
		do {
			let tmpParte = this.Partes[Contador];
			if (tmpParte.Tipo === this.ESPARABRE || tmpParte.Tipo === this.ESFUNCION) {
				this.GenerarPiezasOperador(4, 4, Contador);  /* Evalúa las potencias */
				this.GenerarPiezasOperador(2, 3, Contador);  /* Luego evalúa multiplicar y dividir */
				this.GenerarPiezasOperador(0, 1, Contador);  /* Finalmente evalúa sumar y restar */

				if (tmpParte.Tipo === this.ESFUNCION) { /* Agrega la función a la última pieza */
					this.Piezas[this.Piezas.length-1].Funcion = tmpParte.Funcion;
				}

				/* Quita el paréntesis/función que abre y el que cierra, dejando el centro */
				this.Partes.splice(Contador, 1);
				this.Partes.splice(Contador + 1, 1);
			}
			Contador--;
		} while (Contador >= 0);
	}

	/* Genera las piezas buscando determinado operador */
	GenerarPiezasOperador(OperA, OperB, Inicia) {
		let Contador = Inicia + 1;
		do {
			let tmpParte = this.Partes[Contador];
			if (tmpParte.Tipo === this.ESOPERADOR && (tmpParte.Operador === OperA || tmpParte.Operador === OperB)) {
				let tmpParteIzq = this.Partes[Contador - 1];
				let tmpParteDer = this.Partes[Contador + 1];

				let PosValorA = 0;
				switch (tmpParteIzq.Tipo) {
					case this.ESNUMERO: PosValorA = tmpParteIzq.posNumero; break;
					case this.ESVARIABLE: PosValorA = tmpParteIzq.posVariable; break;
					default: PosValorA = tmpParteIzq.posAcumula; break;
				}

				let PosValorB = 0;
				switch (tmpParteDer.Tipo) {
					case this.ESNUMERO: PosValorB = tmpParteDer.posNumero; break;
					case this.ESVARIABLE: PosValorB = tmpParteDer.posVariable; break;
					default: PosValorB = tmpParteDer.posAcumula; break;
				}

				/* Añade a lista de piezas y crea una nueva posición en Valores */
				this.Valores.push(0);

				/* Crea la pieza */
				this.Piezas.push(new PiezaEvl4(this.Valores.length - 1, -1, PosValorA, tmpParte.Operador, PosValorB));

				/* Elimina la parte del operador y la siguiente */
				this.Partes.splice(Contador, 1);
				this.Partes.splice(Contador, 1);
				//this.ImprimePartes();

				/* Retorna el contador en uno para tomar la siguiente operación */
				Contador--;

				/* Cambia la parte anterior por parte que acumula */
				tmpParteIzq.Tipo = this.ESACUMULA;
				tmpParteIzq.posAcumula = this.Piezas[this.Piezas.length-1].PosResultado;
			}
			Contador++;
		} while (this.Partes[Contador].Tipo !== this.ESPARCIERRA);
	}

	EvaluaSintaxis(ExpresionOriginal) {
		/* Se examina en minúsculas */
		let Minusculas = ExpresionOriginal.toLowerCase();

		/* Reemplaza las funciones de tres letras por una letra */
		let Expresion = Minusculas.replaceAll(" ", "").replaceAll("sen(", "a+(").replaceAll("cos(", "a+(").replaceAll("tan(", "a+(").replaceAll("abs(","a+(").replaceAll("asn(", "a+(").replaceAll("acs(", "a+(").replaceAll("atn(", "a+(").replaceAll("log(", "a+(").replaceAll("cei(", "a+(").replaceAll("exp(", "a+(").replaceAll("sqr(", "a+(").replaceAll("rcb(", "a+(");

		if (!this.BuenaSintaxis00(Expresion)) return 0;
		if (!this.BuenaSintaxis01(Expresion)) return 1;
		if (!this.BuenaSintaxis02(Expresion)) return 2;
		if (!this.BuenaSintaxis03(Expresion)) return 3;
		if (!this.BuenaSintaxis04(Expresion)) return 4;
		if (!this.BuenaSintaxis05(Expresion)) return 5;
		if (!this.BuenaSintaxis06(Expresion)) return 6;
		if (!this.BuenaSintaxis07(Expresion)) return 7;
		if (!this.BuenaSintaxis08(Expresion)) return 8;
		if (!this.BuenaSintaxis09(Expresion)) return 9;
		if (!this.BuenaSintaxis10(Expresion)) return 10;
		if (!this.BuenaSintaxis11(Expresion)) return 11;
		if (!this.BuenaSintaxis12(Expresion)) return 12;
		if (!this.BuenaSintaxis13(Expresion)) return 13;
		if (!this.BuenaSintaxis14(Expresion)) return 14;
		if (!this.BuenaSintaxis15(Expresion)) return 15;
		if (!this.BuenaSintaxis16(Expresion)) return 16;
		if (!this.BuenaSintaxis17(Expresion)) return 17;
		if (!this.BuenaSintaxis18(Expresion)) return 18;
		if (!this.BuenaSintaxis19(Expresion)) return 19;
		if (!this.BuenaSintaxis20(Expresion)) return 20;
		if (!this.BuenaSintaxis21(Expresion)) return 21;
		if (!this.BuenaSintaxis22(Expresion)) return 22;
		if (!this.BuenaSintaxis23(Expresion)) return 23;
		if (!this.BuenaSintaxis24(Expresion)) return 24;
		if (!this.BuenaSintaxis25(Expresion)) return 25;
		if (!this.BuenaSintaxis26(Expresion)) return 26;
		return -1;
	}

	/* Retorna si el Caracter es un operador matemático */
	EsUnOperador(Caracter) {
		return Caracter === '+' || Caracter === '-' || Caracter === '*' || Caracter === '/' || Caracter === '^';
	}

	/* Retorna si el Caracter es un número */
	EsNumero(Caracter) {
		return Caracter >= '0' && Caracter <= '9';
	}

	/* Retorna si el Caracter es una letra */
	EsLetraMinuscula(Caracter) {
		return Caracter >= 'a' && Caracter <= 'z';
	}

	/* 0. Caracter no válido. Ejemplo: 2#4??1 */
	BuenaSintaxis00(Expresion) {
		for (let Contador = 0; Contador < Expresion.length; Contador++)
			if (!this.ChequeaPermitido(Expresion[Contador]))
				return false;
		return true;
	}

	/* Retorna true si el caracter es de los permitidos en una ecuación */
	ChequeaPermitido(Caracter) {
		let Permitidos = "abcdefghijklmnopqrstuvwxyz0123456789.+-*/^()";
		for (let contador = 0; contador < Permitidos.length; contador++)
			if (Caracter === Permitidos[contador]) return true;
		return false;
	}

	/* 1. Un número seguido de una letra. Ejemplo: 2q-(*3) */
	BuenaSintaxis01(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (this.EsNumero(Expresion[Contador]) && this.EsLetraMinuscula(Expresion[Contador + 1]))
				return false;
		return true;
	}

	/* 2. Un número seguido de un paréntesis que abre. Ejemplo: 7-2(5-6) */
	BuenaSintaxis02(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (this.EsNumero(Expresion[Contador]) && Expresion[Contador + 1] === '(')
				return false;
		return true;
	}

	/* 3. Doble punto seguido. Ejemplo: 3..1 */
	BuenaSintaxis03(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === '.' && Expresion[Contador + 1] === '.')
				return false;
		return true;
	}

	/* 4. Punto seguido de operador. Ejemplo: 3.*1 */
	BuenaSintaxis04(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === '.' && this.EsUnOperador(Expresion[Contador+1]))
				return false;
		return true;
	}

	/* 5. Un punto y sigue una letra. Ejemplo: 3+5.w-8 */
	BuenaSintaxis05(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === '.' && this.EsLetraMinuscula(Expresion[Contador + 1]))
				return false;
		return true;
	}

	/* 6. Punto seguido de paréntesis que abre. Ejemplo: 2-5.(4+1)*3 */
	BuenaSintaxis06(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === '.' && Expresion[Contador + 1] === '(')
				return false;
		return true;
	}

	/* 7. Punto seguido de paréntesis que cierra. Ejemplo: 2-(5.)*3 */
	BuenaSintaxis07(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === '.' && Expresion[Contador + 1] === ')')
				return false;
		return true;
	}

	/* 8. Un operador seguido de un punto. Ejemplo: 2-(4+.1)-7 */
	BuenaSintaxis08(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (this.EsUnOperador(Expresion[Contador]) && Expresion[Contador + 1] === '.')
				return false;
		return true;
	}

	/* 9. Dos operadores estén seguidos. Ejemplo: 2++4, 5-*3 */
	BuenaSintaxis09(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (this.EsUnOperador(Expresion[Contador]) && this.EsUnOperador(Expresion[Contador + 1]))
				return false;
		return true;
	}

	/* 10. Un operador seguido de un paréntesis que cierra. Ejemplo: 2-(4+)-7 */
	BuenaSintaxis10(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (this.EsUnOperador(Expresion[Contador]) && Expresion[Contador + 1] === ')')
				return false;
		return true;
	}

	/* 11. Una letra seguida de número. Ejemplo: 7-2a-6 */
	BuenaSintaxis11(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (this.EsLetraMinuscula(Expresion[Contador]) && this.EsNumero(Expresion[Contador + 1]))
				return false;
		return true;
	}

	/* 12. Una letra seguida de punto. Ejemplo: 7-a.-6 */
	BuenaSintaxis12(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (this.EsLetraMinuscula(Expresion[Contador]) && Expresion[Contador + 1] === '.')
				return false;
		return true;
	}

	/* 13. Un paréntesis que abre seguido de punto. Ejemplo: 7-(.4-6) */
	BuenaSintaxis13(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === '(' && Expresion[Contador + 1] === '.')
				return false;
		return true;
	}

	/* 14. Un paréntesis que abre seguido de un operador. Ejemplo: 2-(*3) */
	BuenaSintaxis14(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === '(' && this.EsUnOperador(Expresion[Contador + 1]))
				return false;
		return true;
	}

	/* 15. Un paréntesis que abre seguido de un paréntesis que cierra. Ejemplo: 7-()-6 */
	BuenaSintaxis15(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === '(' && Expresion[Contador + 1] === ')')
				return false;
		return true;
	}

	/* 16. Un paréntesis que cierra y sigue un número. Ejemplo: (3-5)7 */
	BuenaSintaxis16(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === ')' && this.EsNumero(Expresion[Contador + 1]))
				return false;
		return true;
	}

	/* 17. Un paréntesis que cierra y sigue un punto. Ejemplo: (3-5). */
	BuenaSintaxis17(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === ')' && Expresion[Contador + 1] === '.')
				return false;
		return true;
	}

	/* 18. Un paréntesis que cierra y sigue una letra. Ejemplo: (3-5)t */
	BuenaSintaxis18(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === ')' && this.EsLetraMinuscula(Expresion[Contador + 1]))
				return false;
		return true;
	}

	/* 19. Un paréntesis que cierra y sigue un paréntesis que abre. Ejemplo: (3-5)(4*5) */
	BuenaSintaxis19(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (Expresion[Contador] === ')' && Expresion[Contador + 1] === '(')
				return false;
		return true;
	}

	/* 20. Si hay dos letras seguidas (después de quitar las funciones), es un error */
	BuenaSintaxis20(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (this.EsLetraMinuscula(Expresion[Contador]) && this.EsLetraMinuscula(Expresion[Contador + 1]))
				return false;
		return true;
	}

	/* 21. Los paréntesis estén desbalanceados. Ejemplo: 3-(2*4)) */
	BuenaSintaxis21(Expresion) {
		let ParentesisAbre = 0; /* Contador de paréntesis que abre */
		let ParentesisCierra = 0; /* Contador de paréntesis que cierra */
		for (let Contador = 0; Contador < Expresion.length; Contador++) {
			switch (Expresion[Contador]) {
				case '(': ParentesisAbre++; break;
				case ')': ParentesisCierra++; break;
			}
		}
		return ParentesisAbre === ParentesisCierra;
	}

	/* 22. Doble punto en un número de tipo real. Ejemplo: 7-6.46.1+2 */
	BuenaSintaxis22(Expresion) {
		let TotalPuntos = 0; /* Validar los puntos decimales de un número real */
		for (let Contador = 0; Contador < Expresion.length; Contador++) {
			if (this.EsUnOperador(Expresion[Contador])) TotalPuntos = 0;
			if (Expresion[Contador] === '.') TotalPuntos++;
			if (TotalPuntos > 1) return false;
		}
		return true;
	}

	/* 23. Paréntesis que abre no corresponde con el que cierra. Ejemplo: 2+3)-2*(4 */
	BuenaSintaxis23(Expresion) {
		let ParentesisAbre = 0; /* Contador de paréntesis que abre */
		let ParentesisCierra = 0; /* Contador de paréntesis que cierra */
		for (let Contador = 0; Contador < Expresion.length; Contador++) {
			switch (Expresion[Contador]) {
				case '(': ParentesisAbre++; break;
				case ')': ParentesisCierra++; break;
			}
			if (ParentesisCierra > ParentesisAbre) return false;
		}
		return true;
	}

	/* 24. Inicia con operador. Ejemplo: +3*5 */
	BuenaSintaxis24(Expresion) {
		return !this.EsUnOperador(Expresion[0]);
	}

	/* 25. Finaliza con operador. Ejemplo: 3*5* */
	BuenaSintaxis25(Expresion) {
		return !this.EsUnOperador(Expresion[Expresion.length - 1]);
	}

	/* 26. Encuentra una letra seguida de paréntesis que abre. Ejemplo: 3-a(7)-5 */
	BuenaSintaxis26(Expresion) {
		for (let Contador = 0; Contador < Expresion.length - 1; Contador++)
			if (this.EsLetraMinuscula(Expresion[Contador]) && Expresion[Contador + 1] === '(')
				return false;
		return true;
	}
}
