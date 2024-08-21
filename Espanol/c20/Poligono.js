/* Autor: Rafael Alberto Moreno Parra
Fecha: Octubre de 2022
URL: http://darwin.50webs.com
https://github.com/ramsoftware
*/

/* *****************************************************************
 *  El polígono de 4 lados es la pieza básica
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

		
		/*let NumColores = 9;
		let Y1 = 256/(NumColores + 1);
		let Y2 = 256;
		let X1 = -0.5
		let X2 = 0.5
		let M = (Y2-Y1)/(X2-X1);
		let B = Y1 - M*X1;
		let Rojo = Math.floor(M*Centro+B);
		this.ColorDibuja = this.RGBaHexadecimal(Rojo, Math.floor(128-Rojo/2), Math.floor(128+Rojo/2));*/
		
		//Calcula el punto medio de profundidad y dependiendo de eso, le da un color
		let Centro = (this.Z1+this.Z2+this.Z3+this.Z4) / 4;		
		
		this.ColorDibuja = '#006633';
		if (Centro < 0.4) this.ColorDibuja = '#0066CC';
		if (Centro < 0.3) this.ColorDibuja = '#00CCCC';
		if (Centro < 0.2) this.ColorDibuja = '#99CC66';
		if (Centro < 0.1) this.ColorDibuja = '#CC9933';
		if (Centro < 0) this.ColorDibuja = '#CC9999';
		if (Centro < -0.1) this.ColorDibuja = '#CCCCCC';
		if (Centro < -0.2) this.ColorDibuja = '#FF6633';
		if (Centro < -0.3) this.ColorDibuja = '#FFCC66';
		if (Centro < -0.4) this.ColorDibuja = '#FFCC00';
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
		//this.Centro = (posZ1g + posZ2g + posZ3g + posZ4g) / 4;
		
		this.Centro = posZ1g;
		if (posZ2g < this.Centro) this.Centro = posZ2g;
		if (posZ3g < this.Centro) this.Centro = posZ3g;
		if (posZ4g < this.Centro) this.Centro = posZ4g;
	

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
	Dibuja(Lienzo) {
		Lienzo.beginPath(); //Inicia el polígono
		Lienzo.lineWidth = 1;
		Lienzo.moveTo(this.X1p, this.Y1p); //Punto inicial
		Lienzo.lineTo(this.X2p, this.Y2p);
		Lienzo.lineTo(this.X3p, this.Y3p);
		Lienzo.lineTo(this.X4p, this.Y4p);
		Lienzo.lineTo(this.X1p, this.Y1p); //Punto final

		Lienzo.fillStyle = 'black';
		Lienzo.fill();
		Lienzo.strokeStyle = this.ColorDibuja;
		Lienzo.closePath(); //Cierra para hacer el polígono
		Lienzo.stroke(); //Hace visible la línea
	}
	
	//Convierte los números RGB (Red, Green, Blue) en su equivalente hexadecimal de color
	RGBaHexadecimal(R,G,B){
		return "#" + this.Hexadecimal(R) + this.Hexadecimal(G) + this.Hexadecimal(B);
	}

	//Convierte a Hexadecimal
	Hexadecimal(numero){
		numero = parseInt(numero, 10);
		if (isNaN(numero)) return "00";
		numero = Math.max(0, Math.min(numero,255));
		return "0123456789ABCDEF".charAt((numero-numero%16)/16)+"0123456789ABCDEF".charAt(numero%16);
	}	
}
