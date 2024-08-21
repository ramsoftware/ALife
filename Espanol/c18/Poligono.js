/* Autor: Rafael Alberto Moreno Parra
Fecha: Septiembre de 2022
URL: http://darwin.50webs.com
https://github.com/ramsoftware
*/

/* *****************************************************************
 *  El polígono de 4 lados, pieza básica para construir la figura 3D
 * ***************************************************************** */
class Poligono {

	constructor(X1, Y1, Z1, X2, Y2, Z2, X3, Y3, Z3, X4, Y4, Z4) {
		this.X1 = X1; this.Y1 = Y1; this.Z1 = Z1;
		this.X2 = X2; this.Y2 = Y2; this.Z2 = Z2;
		this.X3 = X3; this.Y3 = Y3; this.Z3 = Z3;
		this.X4 = X4; this.Y4 = Y4; this.Z4 = Z4;
	}

	//Normaliza entre -0.5 y 0.5 para tener la figura centrada en cero
	Normaliza(MinimoX, MinimoY, MinimoZ, MaximoX, MaximoY, MaximoZ){
		this.X1 = (this.X1 - MinimoX) / (MaximoX - MinimoX) - 0.5;
		this.Y1 = (this.Y1 - MinimoY) / (MaximoY - MinimoY) - 0.5;
		this.Z1 = (this.Z1 - MinimoZ) / (MaximoZ - MinimoZ) - 0.5;

		this.X2 = (this.X2 - MinimoX) / (MaximoX - MinimoX) - 0.5;
		this.Y2 = (this.Y2 - MinimoY) / (MaximoY - MinimoY) - 0.5;
		this.Z2 = (this.Z2 - MinimoZ) / (MaximoZ - MinimoZ) - 0.5;

		this.X3 = (this.X3 - MinimoX) / (MaximoX - MinimoX) - 0.5;
		this.Y3 = (this.Y3 - MinimoY) / (MaximoY - MinimoY) - 0.5;
		this.Z3 = (this.Z3 - MinimoZ) / (MaximoZ - MinimoZ) - 0.5;

		this.X4 = (this.X4 - MinimoX) / (MaximoX - MinimoX) - 0.5;
		this.Y4 = (this.Y4 - MinimoY) / (MaximoY - MinimoY) - 0.5;
		this.Z4 = (this.Z4 - MinimoZ) / (MaximoZ - MinimoZ) - 0.5;
	}

	//Gira en XYZ, convierte a 2D y cuadra en pantalla
	CalculoPantalla(MatrizGiro, ZPersona, ConstanteX, ConstanteY, MinimoX, MinimoY, XPantallaIni, YPantallaIni) {
		let posX1g = this.X1 * MatrizGiro[0][0] + this.Y1 * MatrizGiro[1][0] + this.Z1 * MatrizGiro[2][0];
		let posY1g = this.X1 * MatrizGiro[0][1] + this.Y1 * MatrizGiro[1][1] + this.Z1 * MatrizGiro[2][1];
		let posZ1g = this.X1 * MatrizGiro[0][2] + this.Y1 * MatrizGiro[1][2] + this.Z1 * MatrizGiro[2][2];

		let posX2g = this.X2 * MatrizGiro[0][0] + this.Y2 * MatrizGiro[1][0] + this.Z2 * MatrizGiro[2][0];
		let posY2g = this.X2 * MatrizGiro[0][1] + this.Y2 * MatrizGiro[1][1] + this.Z2 * MatrizGiro[2][1];
		let posZ2g = this.X2 * MatrizGiro[0][2] + this.Y2 * MatrizGiro[1][2] + this.Z2 * MatrizGiro[2][2];

		let posX3g = this.X3 * MatrizGiro[0][0] + this.Y3 * MatrizGiro[1][0] + this.Z3 * MatrizGiro[2][0];
		let posY3g = this.X3 * MatrizGiro[0][1] + this.Y3 * MatrizGiro[1][1] + this.Z3 * MatrizGiro[2][1];
		let posZ3g = this.X3 * MatrizGiro[0][2] + this.Y3 * MatrizGiro[1][2] + this.Z3 * MatrizGiro[2][2];

		let posX4g = this.X4 * MatrizGiro[0][0] + this.Y4 * MatrizGiro[1][0] + this.Z4 * MatrizGiro[2][0];
		let posY4g = this.X4 * MatrizGiro[0][1] + this.Y4 * MatrizGiro[1][1] + this.Z4 * MatrizGiro[2][1];
		let posZ4g = this.X4 * MatrizGiro[0][2] + this.Y4 * MatrizGiro[1][2] + this.Z4 * MatrizGiro[2][2];

		//Usado para ordenar los polígonos del más lejano al más cercano
		this.Centro = (posZ1g + posZ2g + posZ3g + posZ4g) / 4;

		//Convierte de 3D a 2D (segunda dimensión)
		let X1sd = posX1g * ZPersona / (ZPersona - posZ1g);
		let Y1sd = posY1g * ZPersona / (ZPersona - posZ1g);

		let X2sd = posX2g * ZPersona / (ZPersona - posZ2g);
		let Y2sd = posY2g * ZPersona / (ZPersona - posZ2g);

		let X3sd = posX3g * ZPersona / (ZPersona - posZ3g);
		let Y3sd = posY3g * ZPersona / (ZPersona - posZ3g);

		let X4sd = posX4g * ZPersona / (ZPersona - posZ4g);
		let Y4sd = posY4g * ZPersona / (ZPersona - posZ4g);

		//Cuadra en pantalla física
		this.X1p = Math.trunc(ConstanteX * (X1sd - MinimoX) + XPantallaIni);
		this.Y1p = Math.trunc(ConstanteY * (Y1sd - MinimoY) + YPantallaIni);

		this.X2p = Math.trunc(ConstanteX * (X2sd - MinimoX) + XPantallaIni);
		this.Y2p = Math.trunc(ConstanteY * (Y2sd - MinimoY) + YPantallaIni);

		this.X3p = Math.trunc(ConstanteX * (X3sd - MinimoX) + XPantallaIni);
		this.Y3p = Math.trunc(ConstanteY * (Y3sd - MinimoY) + YPantallaIni);

		this.X4p = Math.trunc(ConstanteX * (X4sd - MinimoX) + XPantallaIni);
		this.Y4p = Math.trunc(ConstanteY * (Y4sd - MinimoY) + YPantallaIni);
	}

	//Hace el gráfico del polígono
	Dibuja(Lienzo, GrosorLinea, ColorLinea, Relleno) {
		Lienzo.beginPath(); //Inicia el polígono
		Lienzo.lineWidth = GrosorLinea;
		Lienzo.strokeStyle = ColorLinea;
		Lienzo.moveTo(this.X1p, this.Y1p); //Punto inicial
		Lienzo.lineTo(this.X2p, this.Y2p);
		Lienzo.lineTo(this.X3p, this.Y3p);
		Lienzo.lineTo(this.X4p, this.Y4p);
		Lienzo.lineTo(this.X1p, this.Y1p); //Punto final

		Lienzo.fillStyle = Relleno;
		Lienzo.fill();
		Lienzo.closePath(); //Cierra para hacer el polígono
		Lienzo.stroke(); //Hace visible la línea
	}
}