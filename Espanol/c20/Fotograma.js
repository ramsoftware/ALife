/* Autor: Rafael Alberto Moreno Parra
Fecha: Octubre de 2022
URL: http://darwin.50webs.com
https://github.com/ramsoftware
*/

/* *********************************************
 *  Un fotograma tiene muchos poligonos
 * ********************************************* */
class Fotograma{
	constructor(NumeroLineasGrafico, Tiempo, Evalua) {
		
		//Donde almacena los poligonos
		this.Poligonos = [];

		//Mínimos y máximos para poder normalizar los valores generados por la ecuación Z=F(X,Y)
		let MinimoX = Number.MAX_VALUE;
		let MaximoX = -MinimoX;
		let MinimoY = Number.MAX_VALUE;
		let MaximoY = -MinimoY;	
		let MinimoZ = Number.MAX_VALUE;
		let MaximoZ = -MinimoZ;
		
        //Calcula cada polígono dependiendo de la ecuación
		let MinTheta = 0;
		let	MaxTheta = 360;
		let MinPhi = 0;
		let MaxPhi = 360;

        let IncTheta = (MaxTheta - MinTheta) / NumeroLineasGrafico;
        let IncPhi = (MaxPhi - MinPhi) / NumeroLineasGrafico;

		for(let Ecuacion = 0; Ecuacion < Evalua.length; Ecuacion++) {
			for (let valTheta = MinTheta; valTheta <= MaxTheta; valTheta += IncTheta) {
				for (let valPhi = MinPhi; valPhi <= MaxPhi; valPhi += IncPhi) {

					//Calcula las 4 coordenadas que tendrá el polígono
					let Theta1 = valTheta * Math.PI / 180;
					let Phi1 = valPhi * Math.PI / 180;
					Evalua[Ecuacion].DarValorVariable('a', Theta1);
					Evalua[Ecuacion].DarValorVariable('b', Phi1);
					Evalua[Ecuacion].DarValorVariable('t', Tiempo);
					let R1 = Evalua[Ecuacion].Evaluar();
					if (isNaN(R1) || !isFinite(R1)) R1 = 0;
					let X1 = R1 * Math.cos(Phi1) * Math.sin(Theta1);
					let Y1 = R1 * Math.sin(Phi1) * Math.sin(Theta1);
					let Z1 = R1 * Math.cos(Theta1);


					let Theta2 = (valTheta + IncTheta) * Math.PI / 180;
					let Phi2 = valPhi * Math.PI / 180;
					Evalua[Ecuacion].DarValorVariable('a', Theta2);
					Evalua[Ecuacion].DarValorVariable('b', Phi2);
					Evalua[Ecuacion].DarValorVariable('t', Tiempo);
					let R2 = Evalua[Ecuacion].Evaluar();
					if (isNaN(R2) || !isFinite(R2)) R2 = 0;
					let X2 = R2 * Math.cos(Phi2) * Math.sin(Theta2);
					let Y2 = R2 * Math.sin(Phi2) * Math.sin(Theta2);
					let Z2 = R2 * Math.cos(Theta2);


					let Theta3 = (valTheta + IncTheta) * Math.PI / 180;
					let Phi3 = (valPhi + IncPhi) * Math.PI / 180;
					Evalua[Ecuacion].DarValorVariable('a', Theta3);
					Evalua[Ecuacion].DarValorVariable('b', Phi3);
					Evalua[Ecuacion].DarValorVariable('t', Tiempo);
					let R3 = Evalua[Ecuacion].Evaluar();
					if (isNaN(R3) || !isFinite(R3)) R3 = 0;
					let X3 = R3 * Math.cos(Phi3) * Math.sin(Theta3);
					let Y3 = R3 * Math.sin(Phi3) * Math.sin(Theta3);
					let Z3 = R3 * Math.cos(Theta3);


					let Theta4 = valTheta * Math.PI / 180;
					let Phi4 = (valPhi + IncPhi) * Math.PI / 180;
					Evalua[Ecuacion].DarValorVariable('a', Theta4);
					Evalua[Ecuacion].DarValorVariable('b', Phi4);
					Evalua[Ecuacion].DarValorVariable('t', Tiempo);
					let R4 = Evalua[Ecuacion].Evaluar();
					if (isNaN(R4) || !isFinite(R4)) R4 = 0;
					let X4 = R4 * Math.cos(Phi4) * Math.sin(Theta4);
					let Y4 = R4 * Math.sin(Phi4) * Math.sin(Theta4);
					let Z4 = R4 * Math.cos(Theta4);

					//Captura el mínimo valor de X de todos los polígonos
					if (X1 < MinimoX) MinimoX = X1;
					if (X2 < MinimoX) MinimoX = X2;
					if (X3 < MinimoX) MinimoX = X3;
					if (X4 < MinimoX) MinimoX = X4;

					//Captura el mínimo valor de Y de todos los polígonos
					if (Y1 < MinimoY) MinimoY = Y1;
					if (Y2 < MinimoY) MinimoY = Y2;
					if (Y3 < MinimoY) MinimoY = Y3;
					if (Y4 < MinimoY) MinimoY = Y4;

					//Captura el mínimo valor de Z de todos los polígonos
					if (Z1 < MinimoZ) MinimoZ = Z1;
					if (Z2 < MinimoZ) MinimoZ = Z2;
					if (Z3 < MinimoZ) MinimoZ = Z3;
					if (Z4 < MinimoZ) MinimoZ = Z4;

					//Captura el máximo valor de X de todos los polígonos
					if (X1 > MaximoX) MaximoX = X1;
					if (X2 > MaximoX) MaximoX = X2;
					if (X3 > MaximoX) MaximoX = X3;
					if (X4 > MaximoX) MaximoX = X4;

					//Captura el máximo valor de Y de todos los polígonos
					if (Y1 > MaximoY) MaximoY = Y1;
					if (Y2 > MaximoY) MaximoY = Y2;
					if (Y3 > MaximoY) MaximoY = Y3;
					if (Y4 > MaximoY) MaximoY = Y4;

					//Captura el máximo valor de Z de todos los polígonos
					if (Z1 > MaximoZ) MaximoZ = Z1;
					if (Z2 > MaximoZ) MaximoZ = Z2;
					if (Z3 > MaximoZ) MaximoZ = Z3;
					if (Z4 > MaximoZ) MaximoZ = Z4;

					//Añade un polígono a la lista
					this.Poligonos.push(new Poligono(X1, Y1, Z1, X2, Y2, Z2, X3, Y3, Z3, X4, Y4, Z4));
				}
			}
		}


		//Luego normaliza las cuatro coordenadas X,Y,Z de cada polígono para que queden entre -0.5 y 0.5
		for (let cont = 0; cont < this.Poligonos.length; cont++) this.Poligonos[cont].Normaliza(MinimoX, MinimoY, MinimoZ, MaximoX, MaximoY, MaximoZ);
	}
	

	CalculaPoligono(AngX, AngY, AngZ, ZPersona, XPantallaIni, YPantallaIni, XPantallaFin, YPantallaFin) {
		this.DatosImagen = null;		
		
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

	//Pinta cada polígono
	Dibuja(Lienzo, Ancho, Alto) {
		if (this.DatosImagen == null){
			for (let cont = 0; cont < this.Poligonos.length; cont++)
				this.Poligonos[cont].Dibuja(Lienzo);
			this.DatosImagen = Lienzo.getImageData(0, 0, Ancho, Alto);
		}
		else
			 Lienzo.putImageData(this.DatosImagen, 0, 0);
		
	}
}
