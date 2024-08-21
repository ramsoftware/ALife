/* Muestra un gráfico en 2D de una onda periódica comportándose en el tiempo
Modo de uso:

Poner esto en un archivo HTML:

		<canvas id="Canvas" width="900" height="500"></canvas>
		<script src="AmbienteTiempo.js"></script>
		<script>
		var Canvas = document.getElementById('Canvas');
		var Lienzo = Canvas.getContext('2d');
		Ambiente = new AmbienteTiempo(Canvas, Lienzo);
		Animacion();

		function Animacion(){
			Ambiente.Logica(); //Lógica de la animación
			Ambiente.Dibujar(); //Visual de la animación
			requestAnimationFrame(Animacion);
		}
		</script>

Autor: Rafael Alberto Moreno Parra
Fecha: Septiembre de 2022
URL: http://darwin.50webs.com
https://github.com/ramsoftware
*/


class AmbienteTiempo{
	constructor(Canvas, Lienzo){
		this.Canvas = Canvas;
		this.Lienzo = Lienzo;
		this.Lienzo.lineWidth = 1;
		this.Lienzo.strokeStyle = "black";
		
		//Área dónde se dibujará el gráfico matemático
		this.XpantallaIni = 1;
		this.YpantallaIni = 1;
		this.XpantallaFin = this.Canvas.width;
		this.YpantallaFin = this.Canvas.height;
		
		//Valor inicial y final de X
		this.Tini = 0;
		this.Tfin = 720;
		
		//Valores de los coeficientes se generan al azar
		this.ValorA = [];
		this.ValorB = [];
		this.ValorC = [];
		this.TotalCurvasSuman = 3;
		this.Ymax = 0; //Valor máximo de Y
		var MinAleatorio = -2;
		var MaxAleatorio = 2;
		for (var cont=1; cont<= this.TotalCurvasSuman; cont++){
			var valorA = Math.random()*(MaxAleatorio-MinAleatorio)+MinAleatorio;
			this.ValorA.push(valorA);
			this.ValorB.push(Math.random()*(MaxAleatorio-MinAleatorio)+MinAleatorio);
			this.ValorC.push(Math.random()*(MaxAleatorio-MinAleatorio)+MinAleatorio);
			this.Ymax += Math.abs(valorA);
		}

		//Valor mínimo de Y
		this.Ymin = -1 * this.Ymax;

		//Número de puntos que conforma el gráfico
		this.numPuntos = 130;
		this.PasoT = (this.Tfin - this.Tini) / this.numPuntos;
		
		//Constantes para cuadrar en pantalla
		this.convierteT = (this.XpantallaFin - this.XpantallaIni) / (this.Tfin - this.Tini);
		this.convierteY = (this.YpantallaFin - this.YpantallaIni) / (this.Ymax - this.Ymin);
		
		//Para guardar los puntos
		this.puntosT = [];
		this.puntosY = [];
	}
	
	Logica() {
		//Inicializa la lista de puntos
		this.puntosT.length = 0;
		this.puntosY.length = 0;
		
		//Calcula el punto en T y el valor en Y. De una vez los cuadra en pantalla
		for (var T = this.Tini; T <= this.Tfin; T += this.PasoT) {
			var Y = this.Ecuacion(T);
			this.puntosT.push(parseInt(this.convierteT * (T - this.Tini) + this.XpantallaIni));
			this.puntosY.push(parseInt(this.convierteY * (Y - this.Ymin) + this.YpantallaIni));
		}
		
		//Para dar el efecto de desplazarse, aumenta los límites mínimo y máximo de T
		this.Tini++;
		this.Tfin++;
	}

	//Ecuación que representa el ambiente periódico
	Ecuacion(T){
		var Total = 0;
		var Tr = Math.PI*T/180;
		for (var cont=0; cont< this.TotalCurvasSuman; cont++){
			Total += this.ValorA[cont] * Math.sin(this.ValorB[cont] * Tr + this.ValorC[cont]);
		}
		return Total;
	}

	Dibujar(){
		this.Lienzo.beginPath();
		this.Lienzo.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
		this.Lienzo.rect(0, 0, this.Canvas.width, this.Canvas.height);

		//Hace el gráfico
		this.Lienzo.moveTo(this.puntosT[0], this.puntosY[0]);
		for(var punto=1; punto < this.puntosT.length; punto++){
			this.Lienzo.lineTo(this.puntosT[punto], this.puntosY[punto]);
			this.Lienzo.stroke(); //Hace visible la línea
		}
		this.Lienzo.closePath(); //Cierra para hacer el polígono
	}	
}