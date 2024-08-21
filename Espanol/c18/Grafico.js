/* Autor: Rafael Alberto Moreno Parra
Fecha: Septiembre de 2022
URL: http://darwin.50webs.com
https://github.com/ramsoftware
*/

/* *********************************************
 *  Hace el gráfico 3D
 * ********************************************* */
class Grafico{
	constructor(){
		//Donde almacena los poligonos
		this.Poligonos = [];
	}

	CalculaEcuacion(MinimoX, MinimoY, MaximoX, MaximoY, NumeroLineasGrafico, Tiempo) {
		//Calcula cada coordenada del gráfico de la ecuación.
		this.Poligonos.length = 0;

		//Mínimos y máximos para poder normalizar los valores generados por la ecuación Z=F(X,Y)
		let MinimoZ = Number.MAX_VALUE;
		let MaximoZ = -MinimoZ;

		//Incrementos para evaluar la ecuación
		let IncrX = (MaximoX - MinimoX) / NumeroLineasGrafico;
		let IncrY = (MaximoY - MinimoY) / NumeroLineasGrafico;

		for (let valX = MinimoX; valX <= MaximoX; valX += IncrX) {
			for (let valY = MinimoY; valY <= MaximoY; valY += IncrY) {
				
				//Calcula los 4 valores del eje Z del polígono
				let Z1 = this.Ecuacion(valX, valY, Tiempo);
				let Z2 = this.Ecuacion(valX + IncrX, valY, Tiempo);
				let Z3 = this.Ecuacion(valX + IncrX, valY + IncrY, Tiempo);
				let Z4 = this.Ecuacion(valX, valY + IncrY, Tiempo);

				//Si un valor de Z es inválido se pone en cero
				if (isNaN(Z1) || !isFinite(Z1)) Z1 = 0;
				if (isNaN(Z2) || !isFinite(Z2)) Z2 = 0;
				if (isNaN(Z3) || !isFinite(Z3)) Z3 = 0;
				if (isNaN(Z4) || !isFinite(Z4)) Z4 = 0;

				//Captura el mínimo valor de Z de todos los polígonos
				if (Z1 < MinimoZ) MinimoZ = Z1;
				if (Z2 < MinimoZ) MinimoZ = Z2;
				if (Z3 < MinimoZ) MinimoZ = Z3;
				if (Z4 < MinimoZ) MinimoZ = Z4;

				//Captura el máximo valor de Z de todos los polígonos
				if (Z1 > MaximoZ) MaximoZ = Z1;
				if (Z2 > MaximoZ) MaximoZ = Z2;
				if (Z3 > MaximoZ) MaximoZ = Z3;
				if (Z4 > MaximoZ) MaximoZ = Z4;

				//Añade un polígono a la lista
				this.Poligonos.push(new Poligono(valX, valY, Z1, valX + IncrX, valY, Z2, valX + IncrX, valY + IncrY, Z3, valX, valY + IncrY, Z4));
			}
		}

		//Luego normaliza los puntos X,Y,Z para que queden entre -0.5 y 0.5
		for (let cont = 0; cont < this.Poligonos.length; cont++) this.Poligonos[cont].Normaliza(MinimoX, MinimoY, MinimoZ, MaximoX+IncrX, MaximoY+IncrY, MaximoZ);
	}
	
	//Aquí está la ecuación 3D que se desee graficar con variable XY
	Ecuacion(X, Y, T) {
		return Math.sqrt(X * X * T + Y * Y * T) + 3 * Math.cos(Math.sqrt(X * X * T + Y * Y * T)) + 5;
	}

	CalculaGrafico(AngX, AngY, AngZ, ZPersona, XPantallaIni, YPantallaIni, XPantallaFin, YPantallaFin) {
		//Genera la matriz de rotación
		let CosX = Math.cos(AngX * Math.PI / 180);
		let SinX = Math.sin(AngX * Math.PI / 180);
		let CosY = Math.cos(AngY * Math.PI / 180);
		let SinY = Math.sin(AngY * Math.PI / 180);
		let CosZ = Math.cos(AngZ * Math.PI / 180);
		let SinZ = Math.sin(AngZ * Math.PI / 180);

		//Matriz de Rotación https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions
		this.Matriz = new Array(3); //Crea dos filas

		//Crea tres columnas por fila
		for (let fila=0; fila < this.Matriz.length; fila++)
			this.Matriz[fila] = new Array(3);

		this.Matriz[0][0] = CosY * CosZ;
		this.Matriz[0][1] = -CosX * SinZ + SinX * SinY * CosZ;
		this.Matriz[0][2] = SinX * SinZ + CosX * SinY * CosZ;

		this.Matriz[1][0] = CosY * SinZ;
		this.Matriz[1][1] = CosX * CosZ + SinX * SinY * SinZ;
		this.Matriz[1][2] = -SinX * CosZ + CosX * SinY * SinZ;

		this.Matriz[2][0] = -SinY;
		this.Matriz[2][1] = SinX * CosY;
		this.Matriz[2][2] = CosX * CosY;
		
		//Los valores extremos al girar la figura en X, Y, Z (de 0 a 360 grados), porque está contenida en un cubo de 1*1*1
		let MaximoX = 0.87931543769177811;
		let MinimoX = -0.87931543769177811;
		let MaximoY = 0.87931543769177811;
		let MinimoY = -0.87931543769177811;

		//Constantes de transformación
		let ConstanteX = (XPantallaFin - XPantallaIni) / (MaximoX - MinimoX);
		let ConstanteY = (YPantallaFin - YPantallaIni) / (MaximoY - MinimoY);

		//Gira los polígonos, proyecta a 2D y cuadra en pantalla
		for (let cont = 0; cont < this.Poligonos.length; cont++) {
			this.Poligonos[cont].CalculoPantalla(this.Matriz, ZPersona, ConstanteX, ConstanteY, MinimoX, MinimoY, XPantallaIni, YPantallaIni);
		}

		//Ordena del polígono más alejado al más cercano, de esa manera los polígonos de adelante son visibles y los de atrás son borrados.
		this.Poligonos.sort((a, b) => { return a.Centro - b.Centro;  });
	}

	//Pinta el gráfico generado por la ecuación
	Dibuja(Canvas, Lienzo, GrosorLinea, ColorLinea, ColorRelleno) {
		Lienzo.clearRect(0, 0, Canvas.width, Canvas.height);
		for (let cont = 0; cont < this.Poligonos.length; cont++)
			this.Poligonos[cont].Dibuja(Lienzo, GrosorLinea, ColorLinea, ColorRelleno);
	}
}